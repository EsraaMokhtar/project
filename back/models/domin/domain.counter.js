const domain = require("./domain.model");

const insertDomain = async(req,res) => { 

    const{contant}=req.body;
      
      try {
          
  
          const newDomain= new domain ({value})
          const savedDomain = await newDomain.save();
  
          res.status(201).json({ message: "Done", status: 201 })
  
      } catch (error) {
          res.status(500).json({ message: "catch err ", error })
      }
  
  
  }




const getAllDomain = function(req, res) {    
    domain.find({}, function (err, domains) {
        res.send(domains);
    });
}

module.exports={
    insertDomain,
    getAllDomain,
   

}