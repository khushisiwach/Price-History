import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const registerUser = async(req,res) => {
    try{
        const{name , email, password} = req.body;

        const existingUser = await User.findOne({email});
          if(existingUser) return res.status(400).json({msg : "User already exist"});

          const hashPassword = await bcrypt.hash(password , 10);

          const newUser = new User({ name , email , password:hashPassword});
        await  newUser.save();
        res.status(201).json({msg :"New user created succesfully"});
    }catch(error){
           res.status(500).json({ msg: "Server error" });
      }
  }


export const loginUser = async(req,res) => {
    try{
   const {email, password} = req.body;
    //  console.log(req.body);
     const user = await User.findOne({email});
     if(!user) return res.status(404).json({msg: "User not found"});
    //  console.log(user);

   const isMatch = await bcrypt.compare(password , user.password);
   if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"});
    //  console.log(isMatch);

   const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
  //  console.log(token)
   res.json({
    token,
    user: { id :user._id , name: user.name , email: user.email},
   })

    } catch(error){
        res.status(500).json({msg:"Server error"})
    }
        
}

export const getUserProfile = async(req, res) => {
try{
  const user = await User.findById(req.user.id).select("-password -__v");
  res.json(user);
} catch(error){
    res.status(500).json({ msg:"Internal Server error"});
}
}

export default {registerUser , loginUser ,getUserProfile};