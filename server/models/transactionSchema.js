import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    doctor:{type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor"},
    
    patient:{type:mongoose.Schema.Types.ObjectId,
            ref:"Patient"},

    price:{type:Number,
            required:true},
    
    discount:{type:Number,
            default:0},
    
    transaction_date:{tyep:Date,
            default:Date.now}

})

export const Transaction = mongoose.model("Transaction",transactionSchema)

