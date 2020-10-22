const mysql = require('mysql')
const nodemailer = require('nodemailer')

const express = require('express')
let router = express.Router()

const DATABASE = 'adult_website'

function maketoken() {
    var res = ''
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charLen = char.length
    for ( var i = 0; i < 15; i++ ) { res += char.charAt(Math.floor(Math.random() * charLen)) }
    return res
}

router.get('/login', (req, res) => {
    res.render('login.hbs')
})

router.post('/auth-login', (req, respond) => {
    let emailLog = req.body.emailLog
    let passwordLog = req.body.passwordLog

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let sqlQuery = `SELECT * FROM users WHERE email="${emailLog}" AND password = "${passwordLog}";`
    con.query(sqlQuery, (err, res) => {
        if (err) { /*   pass    */ }
        if (res.length <= 0) { respond.render('login.hbs', {message: 'You need to create account!'}) }
        else {
            if (res[0].flag == 'undefined') { respond.render('login.hbs') }
            if (res[0].flag == 'unactive') {
                respond.render('login.hbs', {message: 'Please verify account so you can use it!'})
            }
            if (res[0].flag == 'active') {
                req.session.loggedIn = true
                req.session.name = res[0].id
                let uri = res[0].id
                respond.redirect('/myaccount?userId=' + uri)
            }
        }
    })
})

router.get('/register', (req, res) => {
    res.render('register.hbs')
})

router.post('/post-register', (req, respond) => {
    let emailReg = req.body.emailReg
    let passwordReg = req.body.passwordReg

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let verification_code = maketoken()
    let randomNum = Math.floor(Math.random() * 999999999)

    if (!emailReg.includes('@')) {
        respond.render('register.hbs', {message: 'Enter valid email!'})
    } else {
        let sqlQuery = `INSERT INTO users VALUES (${randomNum}, "${emailReg}", "${emailReg}", "${passwordReg}", "${verification_code}", "unactive");`
        con.query(sqlQuery, (err, res) => {
            if (err) { /*   pass    */ }
            else {
                let tp = nodemailer.createTransport({
                    host: '',
                    auth: {
                        user: '',
                        pass: ''
                    }
                })
    
                let mailOtp = {
                    from: '',
                    to: emailReg,
                    subject: '',
                    text: `Thanks for signing up!\nPlease go to link to verify your account localhost:3000/verify?id=${randomNum}&vercode=${verification_code}\nDo not reply to this email!`
                }
                tp.sendMail(mailOtp, (error, info) => {
                    if (error) { respond.render('register.hbs', {message: error}) }
                    else{ respond.render('login.hbs', {message: 'You have successfully signup!'}) }
                })
            }
        })
    }
})

router.get('/verify', (req, res) => {
    let id = req.query.id
    let vercode = req.query.vercode

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:'',
        database: DATABASE
    })

    let sqlQuery = `UPDATE users SET flag="active" WHERE id=${id} AND verification_code="${vercode}";`

    con.query(sqlQuery, (err, respond) => {
        if (err) { /*   pass    */ }
        else {
            res.render('login.hbs', {message: 'Verified! Now you can login.'})
        }
    })
})

router.get('/myaccount', (req, respond) => {
    let id = req.session.name
    let page = req.query.p
    if (!page || page===0) page=1

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let arrayOfData = []
    let arrayTemp = []
    let email = ''
    let user_id = ''

    let sqlQuery = `SELECT * FROM users JOIN videos_data ON users.id=videos_data.users_id WHERE videos_data.users_id=${id};`
    if (req.session.loggedIn) {
        con.query(sqlQuery, (err, res) => {
            if (err) { /*   pass    */ }
            if (res.length <= 0) {
                user_id = id
            } else {
                for (let i=0; i<res.length; i++) {
                    arrayOfData.push({
                        video_id: res[i].video_id,
                        video_thumb: res[i].video_thumb,
                        video_desc: res[i].video_desc
                    })
                    email = res[0].email
                    user_id = res[0].users_id
                }
            }
            let k=0, z=20
            for (let i=1; i<=arrayOfData.length/20; i++) { arrayTemp.push(arrayOfData.slice(k,z)), k+=20,z+=20 }
            const prev = `?p=${page-1}`
            const next = `?p=${parseInt(page)+1}`
            if (page) { respond.render('myaccount.hbs', {arrayOfData: arrayTemp[page-1], prev: prev, next: next, user_id}) } else { respond.render('myaccount.hbs', {arrayOfData: arrayTemp[0], prev: prev, next: next, user_id}) }
        })
    }
    else {
        respond.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router