import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";

export const registerUser = async(req,res)=>{
    const {name,email,password,role,specialization,consultation_fee,balance} = req.body;
    if(!name || !email || !password){
        res.status(400).json({error:"Required fields are missing"})
        return;
    }

    if(role == "doctor"){
        if(!specialization || !consultation_fee){
            res.status(400).json({error:"Required fields for your role are missing"})
            return;
        }
        try {
            let regUser = await Doctor.findOne({email:email});
            if(regUser){
                res.status(400).json({error:"User Exists with this email"})
                return;
            } 
            const hashedPass = await bcrypt.hash(password,10);
            regUser = await Doctor.create({
                name:name,
                email:email,
                password:hashedPass,
                specialization:specialization,
                consultation_fee:consultation_fee
            })
            res.status(200).json({Message:"User Created Successfully",doctor:regUser})
        } catch (error) {
            res.status(500).json({Error:error,message:"Registration Failed"})
        }
    }else{
        let userbalance = balance?balance:0;
        try {
            let regUser = await Patient.findOne({email:email});
            if(regUser){
                res.status(400).json({error:"User Exists with this email"})
                return;
            } 
            const hashedPass = await bcrypt.hash(password,10);
            regUser = await Patient.create({
                name:name,
                email:email,
                password:hashedPass,
                balance:userbalance
            })
            res.status(200).json({Message:"User Created Successfully",patient:regUser})
        } catch (error) {
            res.status(500).json({Error:error.Message,message:"Registration Failed"})
        }
    }

}

export const loginUser = async(req,res)=>{
    const {email,password,role} = req.body;
    if(!email || !password || !role){
        res.status(400).json({error:"Required fields are missing"})
        return;
    }
    try {
        let user;
        if(role == "doctor"){
            user = await Doctor.findOne({email});
        }else{
            user = await Patient.findOne({email});
        }
        if(!user){
            res.status(400).json({error:"No user with these credentials"})
            return;
        }
        const isCorrectPass = await bcrypt.compare(password,user.password)
        if(!isCorrectPass){
            res.status(400).json({error:"Incorrect Password"})
            return;
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn:"8h",
        })
        res.status(200).json({message:"User logged in Successfully",token:token})
    } catch (err) {
        res.status(500).json({error:err,message:"Failed to log in"})
    }
}

export const authUser = async(req,res,next)=>{
    const token = req.header("token")

    if(!token){
        res.status(401).json({error:"User not authorized"})
        return
    }
    try {
        const isAuth = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = isAuth.userId
        next()
    } catch (error) {
        res.status(403).json({error:"Error in authorization"})
    }
}

export const verifyUser = async(req,res)=>{
    const isDoctor = await Doctor.findOne({_id:req.userId});
    if(isDoctor){
        res.status(200).json({isVerified:true,role:"doctor"})
        return;
    }
    res.status(200).json({isVerified:true,role:"patient"})
}

export const getDoctors = async(req,res)=>{
    try{
        const doctors = await Doctor.find();
        res.status(200).json({message:"Doctors fetched",doctors:doctors});
    }catch(err){
        res.status(500).json({message:"Error while fetching doctors",error:err.message})
    }
}