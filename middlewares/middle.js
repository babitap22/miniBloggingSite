const jwt = require('jsonwebtoken')

const authenticate = function (req, res, next) {
    try {
        const header = req.headers["x-api-key"]
        if (header) {
            const verify = jwt.verify(header, "pass123",(error,verify)=>{
                if (error) {
                    if(error.message == "jwt expired"){
                        return res.status(400).send({status:false, message:"Your token is expired"})
                    }
                    else return res.status(401).send({status:false,message:"Authentication failed"})
                }
                req.verify = verify
                next()
            })
        }
        else return res.status(401).send({status:false,message:"Token is missing"})
    }
    catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}


module.exports.authenticate = authenticate
