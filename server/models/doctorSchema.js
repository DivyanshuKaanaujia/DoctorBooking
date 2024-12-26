import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
    name:{type:String,
        required:[true,"Provide a name"],
        minlength:[2,"Minimum name length limit is 2"]},

    email:{type:String,
        required:[true,"Provide an email"],
        validate:[validator.isEmail,"Provide a valid Email"]},

    password:{type:Number,
        required:[true,"Provide a password"]},
    
    specialization:{type:String,
        required:[true,"Provide specialization"]},

    consultaion_fee:{type:Number,
        required:[true,"Provide a consultaion fee"]},

    created_at:{type:Date,
        default:Date.now}
})

export const Doctor = mongoose.model("Doctor",doctorSchema)
