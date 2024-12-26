import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
    name:{type:String,
        required:[true,"Provide a name"],
        minlength:[2,"Minimum name length limit is 2"]},

    email:{type:String,
        required:[true,"Provide an email"],
        validate:[validator.isEmail,"Provide a valid Email"]},

    password:{type:Number,
        required:[true,"Provide a password"]},

    balance:{type:Number,
            default:0},

    created_at:{type:Date,
        default:Date.now}
})

export const Patient = mongoose.model("Patient",patientSchema)

