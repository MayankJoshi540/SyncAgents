import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import getCurrentUser from "./controller/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithUser, customProxy } from "./utils/proxyWithHeaders.js";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL ,
    credentials : true
}))
app.use(cookieParser())
app.use("/api/auth", customProxy(process.env.AUTH_SERVICE_URL))

app.get("/api/me",protect,getCurrentUser);
app.use("/api/chat",protect,proxyWithUser(process.env.CHAT_SERVICE))  
app.use("/api/agent",protect,proxyWithUser(process.env.AGENT_SERVICE_URL));
app.get("/",(req,res)=>{
    res.json({message : "hello from gateway"});
});

app.listen(port,()=>{
    console.log(`gateway is running at ${port}`);
});
