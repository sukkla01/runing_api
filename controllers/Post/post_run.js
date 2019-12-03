const moment = require('moment')

exports.create = (req, res, next) => {
    let { body } = req

    let post = {
        username:body.username,
        topic:body.topic,
        image:body.image[0],
        d_update: moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss')

    }

    req.getConnection(function (err, connection) {


        connection.query("insert into post set ?", post, (err, results) => {
            if (err) return console.log(err)
            insertImage(results.insertId)
            res.send({ status: 'ok', results })
        })

    })


    insertImage = (id) =>{
        body.image.map((image, index) => {
            const postImage = {
                id:null,
                post_id: id,
                image: image
            }
            req.getConnection(async (err, connection) => {
                try {
                    await connection.query("insert into post_image set ?", postImage)

                    // res.send({ status: 'ok', results })
                } catch (error) {
                    next(error);
                }

            })

        })
    }

}


exports.findByImage = (req, res, next) => {
    // let username = parseInt(req.params.id)
    let id = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        let sql = "SELECT if(image is null ,null,CONVERT(image USING utf8)) AS original,if(image is null ,null,CONVERT(image USING utf8)) AS thumbnail  FROM post_image WHERE post_id= ? ";
        connection.query(sql, [id], (err, row) => {
            if (err) return next(err)
            res.send(row)
        })
    })
    
}
exports.findPost = (req, res, next) => {
    // let username = parseInt(req.params.id)
    let id = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        let sql = `SELECT p.*,SUM(if(l.id is null ,0,1)) AS tcount 
        FROM post p
        LEFT JOIN like_post l on l.post_id = p.id
        GROUP BY p.id desc`;
        connection.query(sql, [id], (err, row) => {
            if (err) return next(err)
            res.send(row)
        })
    })
    
}
exports.findLikeuser = (req, res, next) => {
    // let username = parseInt(req.params.id)
    let id = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        let sql = `SELECT * FROM like_post WHERE post_id = ? `;
        connection.query(sql, [id], (err, row) => {
            if (err) return next(err)
            res.send(row)
        })
    })
    
}



exports.createLike = (req, res, next) => {
    let { body } = req

    let post = {
        id:null,
        post_id:body.post_id,
        username:body.username,
        d_update: moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss')

    }

    req.getConnection(function (err, connection) {


        connection.query("insert into like_post set ?", post, (err, results) => {
            if (err) return console.log(err)
            res.send({ status: 'ok', results })
        })

    })



}