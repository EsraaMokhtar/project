const express = require("express");

const router = express.Router();

const User = require("../models/user.model");

// register
router.post('/users', async (req,res) => {
    let user  = await User.findOne({email: req.body.email});
    if(user){

        res.send({message:"This email is already exist "})
              
           }else{
            const doc = await insertRecord(req , res)
            console.log(doc);
          res.send({message:"Register sucess",doc});
    }
});   

// login 
router.post("/Login",(req,res)=>{
    const {email,password} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
           if(password === user.password){
               res.send({message:"login sucess",user:user})
           }else{
               res.send({message:"Incorrect Password or email"})
           }
        }else{
            res.send("not register")
        }
    })
});

// get all user
router.get('/users', function(req, res) {    
    User.find({}, function (err, users) {
        res.send(users);
    });
});

// get single user 
router.get('/getUserByID/:id', (req, res) => {
    const { id }   = req.params;
    console.log(id);
    User.find({}, function (err, users) {
      const user =  users.find((ele) => {
            return ele._id == id
        })
        res.send(user);
    });
});

// insert user data
async function insertRecord(req ,res){
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = req.body.password;
    user.specializations = req.body.specializations;
    user =  await user.save();
    return {user};
}

// editProfile
router.put('/editProfile' , async (req, res) => {
    var user = User.findById(req.body.userId);
    User.findByIdAndUpdate(req.body.userId,req.body.data, await function(err,res){
        if(err) throw err
    })
});
 
module.exports = router;