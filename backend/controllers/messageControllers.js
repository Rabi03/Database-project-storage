const db=require('../connectDatabase');

exports.sendMessage=(req, res) => {
    const channelId=req.params.channel_id;
    const newMessage={
        channel_id:channelId,
        sender_id:req.user.user_id,
        ...req.body
    };

    const updateChannel={
        last_message:req.body.message,
        sender_id:req.user.user_id,
    };

    const sql=
    `
    INSERT INTO message SET timestamp=CURRENT_TIMESTAMP(), ?;
    UPDATE channel
    SET timestamp=CURRENT_TIMESTAMP(), ?
    WHERE channel_id='${channelId}';
    `;

    db.query(sql,[newMessage,updateChannel],(err, result)=>{
        if(err) {
            return res.status(400).json({
                success:false,
                error:err
            })
        }
        return res.status(200).json({
            message:"Send message successfully"
        })
    });
};

exports.allMessages=(req,res)=>{
    const channelId=req.params.channel_id;

    const sql=
        `
            SELECT * 
            FROM message m  
            JOIN user u 
            ON (u.user_id=m.sender_id)
            WHERE m.channel_id='${channelId}'
        `
    
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(400).json({
                success: false,
                error:err
            })
        }

        return res.status(200).json({
            messages:result
        })
    });
}