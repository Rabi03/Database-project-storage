const uuid = require('uuid');
const db=require('../connectDatabase');

exports.createCourse=(req, res) => {
    const course_id=uuid.v4();
    const community_id=req.params.community_id;


    const data={
        course_id: course_id,
        community_id:community_id,
        ...req.body
    };

    const sql='INSERT INTO course SET ?;INSERT INTO promotion SET ?;';

    db.query(sql,[data,data], (err,result) => {
        if(err) {
            return res.status(400).json({
                error:err
            })
        }
        return res.status(200).json({
            success:true,
            message:'Course is created successfully'
        })
    });

};

exports.enrollCourse=(req, res) => {
    const user_id=req.user.user_id;
    const {community_id,course_id}=req.body;

    const data={
        user_id:user_id,
        course_id:course_id,
        community_id:community_id
    }

    const sql=`INSERT INTO enroll SET ?`

    db.query(sql, data,(err, result) => {
        if(err) return res.status(400).json({error:err});
        return res.status(200).json({
            success: true,
            message:"Enrolled successfully"
        });
    });
};