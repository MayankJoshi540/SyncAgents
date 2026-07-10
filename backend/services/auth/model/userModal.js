import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUID :{
        type : String,
        unique:true,
    },
    name:String,
    email:String,
    avatar:String,
    credits: {
        type: Number,
        default: 1000
    },
    totalCredits: {
        type: Number,
        default: 1000
    }
},{
    timestamps: true
})
const User = mongoose.model("User", userSchema);
export default User