import bcrypt from "bcrypt"
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";

export const resgisterUser = async(req,res)=>{
    const {name,email,password,role,specialization,consultation_fee,balance} = req.body;
    if(!name || !email || !password || !role){
        res.status(400).json({error:"Required fields are missing"})
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
            let regUser = await Doctor.findOne({email:email});
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