import redisClient from "../../shared/redis/redis.js"

const protect = async(req,res,next)=>{
    try{
       const sessionId = req.cookies?.session || req.cookies?.session_id
       if(!sessionId){
        return res.status(401).json({message:"unauthorised"})
       }
       const userData =await redisClient.get(`session:${sessionId}`)
       if(!userData){
        return res.status(401).json({message:"Session Expired"})
       }
       req.user = JSON.parse(userData)
       next()       
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}

export default protect