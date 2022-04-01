const db=require('../connectDatabase');
const jwt=require('jsonwebtoken');
const config=require('config');

exports.isAuthenticated = (req, res, next) => {
    const {token}=req.cookies;

    if(!token){
        return res.status(400).send({
            success:false,
            error:{
                message: 'Login first to access this resource'
            }
        })
    }

    const decoded = jwt.verify(token,config.get('JWT_SECRECT'));

    const sql = 'SELECT user_id,name,email,image,role FROM user where user_id=?'

    db.query(sql,decoded.id,(err,result)=>{
        if(err) return res.status(401).send({
            success: false,
            error:{
                message:err
            }
        });

        req.user=result[0];
        next();
    })
};

exports.authorizedRols=(role) => {
    return (req, res, next)=>{
        if(role!==req.user.role){
            return res.status(403).send({
                error:{
                    message: 'You are not allowed to access this resource',
                    
                }
            });
        }
        next()
    }
};

exports.authorizedMember=(req, res, next)=>{
    const user_id = req.user.user_id;
    const communityId=req.params.community_id;

    const sql = 
        `SELECT user_id 
         FROM user 
         WHERE EXISTS (
            SELECT user_id 
            FROM create_join_community_instructor i
            WHERE i.user_id=${user_id} AND i.community_id=${communityId}
         )
         OR EXISTS(
            SELECT user_id 
            FROM join_community_as_student s
            WHERE s.user_id=${user_id} AND s.community_id=${communityId}
         )
         `
    
    db.query(sql,(err, result) => {
        if(err){
            return res.status(400).json({
                error:err
            });
        }

        if(!result[0].user_id){
            return res.status(403).send({
                error:{
                    message: 'You are not allowed to access this resource'
                }
            })
        }

        next();
    });
};


exports.isAdmin=(req, res, next)=>{
    const userId=req.user.user_id;

    const sql=`SELECT join_as FROM create_join_community_instructor WHERE user_id=?`;

    db.query(sql,userId,(err, result) => {
        if(err){
            return res.status(403).json({
                error:err
            })
        }
        else if(result.length===0){
            return res.status(403).json({
                error:{
                    message:"You have not join the community"
                }
            })
        }
        console.log(result);
        const join_as=result[0].join_as;
        if(join_as.includes('admin')){
            next();
        }
        else{
            return res.status(403).json({
                error:{
                    message:"you are not allowed to access"
                }
            });
            
        }

    })
};