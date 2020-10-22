const mysql = require('mysql')

const express = require('express')
let router = express.Router()

const DATABASE = 'adult_website'

router.post('/commenting', (req, res) => {
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let userid = req.query.userid
    let postid = req.query.postid

    if (req.session.loggedIn == true) {
        con.query(`INSERT INTO comments VALUES (${postid}, ${userid}, "${req.body.comment_box}");`, (err, respond) => {
            if (err) { console.log(err) }
            else { res.redirect(`/video/${postid}`) }
        })
    } else {
        res.render('login.hbs', {message: 'Login to be able to comment!'})
    }
})

router.get('/comments', (req, res) => {
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let arrayOfComments = []
    con.query(`SELECT * FROM comments WHERE post_id=${postid};`, (err, respond) => {
        if (err) {console.log(err)}
        if (respond.length <= 0) { 
            arrayOfComments.push({
                comment: 'No comments'
            })
        } else {
            for (let i=respond.length-1; i>=0; i--){
                arrayOfComments.push({
                    users_id: respond[i].users_id,
                    comment: respond[i].comment
                })
            }
            res.render('video.hbs', {arrayOfComments})
        }
    })
})

module.exports = router