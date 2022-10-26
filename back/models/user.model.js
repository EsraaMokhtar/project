const mongoose = require("mongoose");

var userSchema =new mongoose.Schema({
    name:{
        type: String,
        required: "This Fieled is required"
    },
    email:{
        type: String,
        required: "This Fieled is required"
    },
    phone:{
        type: String,
        required: "This Fieled is required"
    },
    password:{
        type: String,
        required: "This Fieled is required"
    },
    specializations:[{
        type: String,
        required: "This Fieled is required"
    }],
    points:{
        type: Number,
         default:0
       
    },
    wishCourses:[{
        name:{
            type: String,
            required: "This Fieled is required"
        },
        time:{
            type: String,
            required: "This Fieled is required"
        },
        point:{
            type: Number,
            required: "This Fieled is required"
        }

    }],
    redeemedCourses:[{
        name:{
            type: String,
            required: "This Fieled is required"
        },
        time:{
            type: String,
            required: "This Fieled is required"
        },
        point:{
            type: Number,
            required: "This Fieled is required"
        }

    }],
},
{
    collection:"user",
    versionKey:false,
}

);

userSchema.virtual("userId").get(function(){
    return this._id.toString()
}).set(function(x){
    this._id =x
})
    
module.exports = mongoose.model('User', userSchema);
