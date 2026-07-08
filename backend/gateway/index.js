import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors"
import cookieParser from "cookie-parser";
import getCurrentUser from "./controller/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithUser } from "./utils/proxyWithHeaders.js";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL ,
    credentials : true
}))
app.use(cookieParser())
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL, {
    proxyErrorHandler: function(err, res, next) {
        console.error("Gateway Auth Proxy Error:", err.message || err);
        return res.status(500).json({ 
            message: "Auth Service is currently unreachable or encountered an error.", 
            error: err.message 
        });
    }
}))
app.get("/api/me",protect,getCurrentUser);
app.use("/api/chat",protect,proxyWithUser(process.env.CHAT_SERVICE))  

app.get("/",(req,res)=>{
    res.json({message : "hello from gateway"});
});

app.listen(port,()=>{
    console.log(`gateway is running at ${port}`);
});

