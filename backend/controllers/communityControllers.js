const uuid = require('uuid');
const db=require('../connectDatabase');

exports.createCommunity=(req,res)=>{
    const id=uuid.v4();
    const channel_id=uuid.v4();
    const data={
        community_id:id,
        name:req.body.name,
        image:'https://res.cloudinary.com/practicaldev/image/fetch/s--oNrsKUe5--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/qksk17083xb3qt4wyzq1.jpg'
    };

    const createorjoinData={
        user_id:req.user.user_id,
        community_id:id,
        join_as:req.body.join_as,
    }

    const channelData={
        channel_id:channel_id,
        community_id:id
    }

    const sql=`
    INSERT INTO community SET ?;
    INSERT INTO create_join_community_instructor SET ?;
    INSERT INTO channel SET ?;
    `;

    db.query(sql,[data,createorjoinData,channelData],(err,result)=>{
        if(err){
            return res.status(400).send({
                success: false,
                error: {
                  message: err,
                },
              });
        }
        return res.status(200).json({
            community_id:id,
            channel_id:channel_id
        })
    })
};

exports.join_as_instructor =(req, res) => {
    const joinData={
        user_id:req.user.user_id,
        ...req.body
    };

    const sql=`INSERT INTO create_join_community_instructor SET ?`

    db.query(sql,joinData,(err, result) =>{
        if(err){
            return res.status(400).json({
                success: false,
                error:err
            })
        }
        return res.status(200).json({
            success: true,
            message:'Successfully joined as instructor'
        })
    });
};

exports.join_as_student =(req, res) => {
    const joinData={
        user_id:req.user.user_id,
        ...req.body
    };

    const sql=`INSERT INTO join_community_as_student SET ?`

    db.query(sql,joinData,(err, result) =>{
        if(err){
            return res.status(400).json({
                success: false,
                error:err
            })
        }
        return res.status(200).json({
            success: true,
            message:'Successfully joined as student'
        })
    });
};

