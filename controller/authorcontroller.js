
const validation=require("../validator/validator")
const authorModel=require("../models/authorModel")
 let{ isEmpty, isValidName,isValidPassword } = validation
 const jwt=require("jsonwebtoken")


const createAuthor= async function(req,res){
    try{
    const data=req.body
    if(Object.keys(data).length==0) return res.status(400).send("fields are Mandatory to Create")
    let {emailId,firstName,lastName,title,password} =data
    if(!isEmpty(firstName)) return res.status(400).send({status: false , message : "Firstname Should Be Present"})
    if(!isEmpty(lastName)) return res.status(400).send({status: false , message : "LastName Should Be Present"})
    if(!isEmpty(emailId)) return res.status(400).send({status: false , message : "emailId Should Be Present"})
    if(!isEmpty(password)) return res.status(400).send({status: false , message : "password Should Be Present"})
    if(!isEmpty(title)) return res.status(400).send({status: false , message : "title Should Be Present"})
    else {
        if(title!="Mr"&&title!="Mrs"&&title!="Miss")  return res.status(400).send({status: false , message : "title Should Be Valid"})
    }
    if(!isValidName(firstName)) return res.status(400).send({status:false,message:"firstname is wrong"})
    if(!isValidName(lastName)) return res.status(400).send({status:false,message:"lastname is wrong"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,message:"password is wrong"})
    const pattern= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const validmail=emailId.match(pattern)
    if(!validmail) return res.status(400).send("Enter Valid EmailId")
    const mail=await authorModel.findOne({emailId:emailId})
    if(mail)return res.status(400).send({status:false,message:"EmailId Already Present"})
    const create=await authorModel.create(data)
    res.status(201).send({status:true,message:"Author Created",data:create})
    }
    catch(err){
    res.status(500).send(err.message)
    }
} 

const login = async function (req, res) {
    try {
        const emailId = req.body.emailId
        const password = req.body.password
        const check = await authorModel.findOne({$and:[{ emailId: emailId ,  password: password }]})
        if (!check) return res.status(400).send({ status: false, message: "EmailId or Password Not found" })
        const create = jwt.sign({ authorId: check._id.toString(), password: password }, "pass123")
        res.setHeader('x-api-key', create)
        res.status(201).send({ status: true, message: "Token Created", data: create })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createAuthor=createAuthor
module.exports.login = login

