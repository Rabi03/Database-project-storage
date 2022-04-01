const config=require('config');
const jwt=require('jsonwebtoken');

const sendToken=(user_id,role,statusCode,res) => {

    const token =jwt.sign({id:user_id,role:role},config.get('JWT_SECRECT'),{
        expiresIn:config.get('JWTEXPIRETIME')
    });

    const options = {
        expires: new Date(
            Date.now() +config.get('COOKIEEXPIRETIME')*24*60*60*1000,
        ),
        httpOnly:true
    }

    res.status(statusCode).cookie('token',token,options).json({
        token,
        user_id,
        role
    })
}

module.exports =sendToken;