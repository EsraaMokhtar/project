const domainSchema = require("./domain.schema");

const mongoose=require("mongoose");
const domain = mongoose.model("domain",domainSchema)

module.exports=domain;