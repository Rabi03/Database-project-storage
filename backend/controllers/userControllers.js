const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const sendToken = require('../utils/SendToken');
const db=require('../connectDatabase');

exports.registration =async(req, res) => {
    const id=uuid.v4();
    const {password,role} = req.body;
    const newPassword=await bcrypt.hash(password,12);

    req.body.password=newPassword;
    const data={
        user_id:id,
        ...req.body
    }
    const sql='INSERT INTO user SET ?';

    db.query(sql,data,(err, result)=>{
        if(err) {
            return res.status(400).send({
                error:err
            });
        }
        sendToken(id,role,200,res);
    });
};

exports.login=(req, res)=>{
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(401).send({
            success: false,
            error: {
              message: "Please enter your email or password",
            },
          });
    }

    const sql='SELECT * FROM user WHERE email=?';

    db.query(sql,email,async(err,result)=>{
        if(err) return res.status(400).send({
            error:err
        });
        const user=result[0];
        if(!user) return res.status(201).json({
            message:'Email not found'
        })
        isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
        sendToken(user.user_id,user.role,200,res);
        }
        else{
            return res.status(401).send({
                success: false,
                error: {
                  password: "Password is not correct",
                },
              });
        }
    });

};

exports.getCurrentUser =(req, res)=>{
    const user_id=req.user.user_id;
    const sql='SELECT * FROM user WHERE user_id=?';

    db.query(sql,user_id,(err,result)=>{
        if(err){
            return res.status(400).json({
                success: false,
                error:err
            });
        }
        return res.status(200).json({
            user:result[0]
        })
    });
}