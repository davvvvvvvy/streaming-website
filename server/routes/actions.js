const mysql = require('mysql')
const cheerio = require('cheerio')
const axios = require('axios')

const express = require('express')
let router = express.Router()

let DATABASE = 'adult_website'

router.post('/myaccount', (req, res) => {
    let userId = req.session.name
    
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    if (req.body.select_db == 'videos_data') {
        con.query('SELECT * FROM videos_data;', (err, respond) => { if (err) { /*   pass    */ } 
            if (respond.length <= 0) {
                let latestid = Math.floor(Math.random() * 99999999) 
                
                let sqlQuery = `INSERT INTO videos_data VALUES (${latestid+1}, "${req.body.url_inpt.replace('\\', '')}", "${req.body.title.replace('\\', '')}", "${req.body.thumb.replace('\\', '')}", "${req.body.description.replace('\\', '')}", "${req.body.tags.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/video/${latestid+1}`) }
                })
            }
            else { 
                let latestid = respond[respond.length-1].video_id 
                
                let sqlQuery = `INSERT INTO videos_data VALUES (${latestid+1}, "${req.body.url_inpt.replace('\\', '')}", "${req.body.title.replace('\\', '')}", "${req.body.thumb.replace('\\', '')}", "${req.body.description.replace('\\', '')}", "${req.body.tags.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/video/${latestid+1}`) }
                })
            } 
        })
    }
    if (req.body.select_db == 'gifs_data') {
        con.query('SELECT * FROM gifs_data;', (err, respond) => { if (err) { /*   pass    */ } 
            if (respond.length <= 0) {
                let latestid = Math.floor(Math.random() * 99999999) 
                
                let sqlQuery = `INSERT INTO gifs_data VALUES (${latestid+1}, "${req.body.title.replace('\\', '')}", "${req.body.url_inpt.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/gif${latestid+1}`) }
                })
            }
            else { 
                let latestid = respond[respond.length-1].gif_id 
                
                let sqlQuery = `INSERT INTO gifs_data VALUES (${latestid+1}, "${req.body.title.replace('\\', '')}", "${req.body.url_inpt.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/gif${latestid+1}`) }
                })
            } 
        })
    }
    if (req.body.select_db == 'porn_stories') {
        con.query('SELECT * FROM porn_stories;', (err, respond) => { if (err) { /*   pass    */ } 
            if (respond.length <= 0) {
                let latestid = Math.floor(Math.random() * 99999999) 
                
                let sqlQuery = `INSERT INTO porn_stories VALUES (${latestid+1}, "${req.body.title.replace('\\', '')}", "${req.body.description.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/stories${latestid+1}`) }
                })
            }
            else { 
                let latestid = respond[respond.length-1].id 
                
                let sqlQuery = `INSERT INTO porn_stories VALUES (${latestid+1}, "${req.body.title.replace('\\', '')}", "${req.body.description.replace('\\', '')}", ${userId});`
                con.query(sqlQuery, (err, respond) => {
                    if (err) { res.send(err) }
                    else { res.redirect(`/stories${latestid+1}`) }
                })
            } 
        })
    }
})

module.exports = router;