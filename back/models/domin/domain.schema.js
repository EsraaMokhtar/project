const {Schema} =require("mongoose");

const domainSchema=new Schema({

value:String,


},
{
    collection:"domain",
    versionKey:false,
},
{
    timeStamps: true
})
module.exports=domainSchema;