import { getAuth } from "firebase-admin/auth"
import {app} from "../config/firebase.js" 
import User from "../model/userModal.js"
import crypto from "crypto"
import redisClient from "../../../shared/redis/redis.js"
export const login = async (req, res) => {
    try {
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
             firebaseUID: decoded.uid
        })
        if(!user){
            user = await User.create({
                firebaseUID: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }
        const sessionId = crypto.randomUUID();
        await redisClient.set(`session:${sessionId}`, JSON.stringify({
            userID:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }), 'EX', 60*60*24*7);  
        res.cookie("session",sessionId , {
            httpOnly: true,
            secure: false,
            sameSite:"strict",
            maxAge: 1000 * 60 * 60 * 24 * 7 
        })
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Unauthorized"})   
    }
}

export const logOut = async(req,res)=>{
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"}); 
        }
        await redisClient.del(`session:${sessionId}`);
        res.clearCookie("session");
        return res.status(200).json({message:"Logged out successfully"}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}   

export const getCurrentUser = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"}); 
        }
        const userData = await redisClient.get(`session:${sessionId}`);
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(JSON.parse(userData));
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body;
        console.log("Deduct credits request:", { userId, agent });
        
        const allUsers = await User.find({});
        console.log("All users in Auth DB:", allUsers.map(u => ({ id: u._id, email: u.email })));

        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found for ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }
        
        const cost = 10;
        
        if (user.credits < cost) {
            return res.status(400).json({
                title: "Insufficient Credits",
                message: "You don't have enough credits. Please upgrade your plan."
            });
        }
        
        user.credits -= cost;
        await user.save();
        
        // Also update session in redis so subsequent /api/me requests see the updated credit balance!
        const sessionId = req.cookies?.session;
        if (sessionId) {
            const userData = await redisClient.get(`session:${sessionId}`);
            if (userData) {
                const parsed = JSON.parse(userData);
                parsed.credits = user.credits;
                await redisClient.set(`session:${sessionId}`, JSON.stringify(parsed), 'EX', 60*60*24*7);
            }
        }
        
        return res.status(200).json({ success: true, credits: user.credits });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};   