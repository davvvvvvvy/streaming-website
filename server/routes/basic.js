const mysql = require('mysql')

const express = require('express')
let router = express.Router()

const DATABASE = 'adult_website'

router.get('/about', (req, res) => {
    res.render('about.hbs')
})

router.get('/FAQ', (req, res) => {
    res.render('FAQ.hbs')
})

router.get('/', (req, respond) => {
    let find = req.query.search
    let page = req.query.p
    if (!page || page===0) page=1

    if (find) { sqlQuery = `SELECT * FROM videos_data WHERE video_tags LIKE "%${find}%" OR video_title LIKE "%${find}%";` }
    else { sqlQuery = 'SELECT * FROM videos_data;' }

    let arrayOfData = []
    let arrayTemp = []

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    con.query(sqlQuery, (err, res) => {
        if (err) { console.log('selection error') }
        else {
            if (!find) {
                for (let i=res.length-1; i>=0; i--) {
                    arrayOfData.push({
                        id: res[i].video_id,
                        url: res[i].video_url,
                        thumb: res[i].video_thumb,
                        desc: res[i].video_desc,
                        tags: res[i].video_tags,
                        title: res[i].video_title
                    })
                }
            } else {
                for (let i=res.length-1; i>=0; i--) {
                    arrayOfData.push({
                        id: res[i].video_id,
                        url: res[i].video_url,
                        thumb: res[i].video_thumb,
                        desc: res[i].video_desc,
                        tags: res[i].video_tags,
                        title: res[i].video_title
                    })
                }
            }
        }
        let k=0, z=20
        for (let i=0; i<=arrayOfData.length/20; i++) { arrayTemp.push(arrayOfData.slice(k,z)), k+=20,z+=20 }
        const prev = `?p=${page-1}`
        const next = `?p=${parseInt(page)+1}`
        respond.render('index.hbs', {arrayOfData: arrayTemp[page-1], prev: prev, next: next})
    })

    con.commit()
    con.end()
})

router.get('/video/:id', (req, respond) => {
    let id = req.params.id
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE,
        multipleStatements: true
    })

    let arrayOfData = []
    let arrayOfComments = []
    let tagsData = []
    let size = []
    con.query(`SELECT * FROM videos_data WHERE video_id=${id}; SELECT * FROM videos_data WHERE LOCATE((SELECT SUBSTRING_INDEX(video_tags, ",", 1) FROM videos_data WHERE video_id=${id}), video_tags) > 0;`, (err, res) => {
        if (err) { console.log('selection error') }
        else {
            con.query(`SELECT * FROM comments WHERE post_id=${id};`, (err, res) => {
                if (err) {console.log(err)}
                if (res.length <= 0) { 
                    arrayOfComments.push({
                        comment: 'No comments',
                    })
                } else {
                    for (let i=res.length-1; i>=0; i--){
                        arrayOfComments.push({
                            users_id: res[i].users_id,
                            comment: res[i].comment,
                            size: res.length
                        })
                    }
                }
            })
            arrayOfData.push({
                id: res[0][0].video_id, url: res[0][0].video_url, thumb: res[0][0].video_thumb, desc: res[0][0].video_desc, tags: res[0][0].video_tags, title: res[0][0].video_title, user_id: res[0][0].users_id
            })

            for (let i=0; i<res.length; i++) {
                try {
                    tagsData.push({
                        id: res[1][i].video_id, url: res[1][i].video_url, thumb: res[1][i].video_thumb, desc: res[1][i].video_desc, tags: res[1][i].video_tags, title: res[1][i].video_title, user_id: res[0][i].users_id
                    })
                } catch (error) { /*  pass    */ }
            }
        }
        respond.render('video.hbs', {
            url: arrayOfData[0].url, id: arrayOfData[0].id, thumb: arrayOfData[0].thumb, desc: arrayOfData[0].desc, tags: arrayOfData[0].tags, title: arrayOfData[0].title, user_id: arrayOfData[0].user_id, tagsData, arrayOfComments
        })
    })
})

router.get('/stories', (req, respond) => {
    let find = req.query.search
    let page = req.query.p

    if (!page || page===0) page=1

    if (find) { sqlQuery = `SELECT * FROM porn_stories WHERE title LIKE "%${find}%";` }
    else { sqlQuery = 'SELECT * FROM porn_stories;' }

    let arrayOfData = []
    let arrayTemp = []

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    con.query(sqlQuery, (err, res) => {
        if (err) { /*   pass    */ }
        else {
            for (let i=res.length-1; i>=0; i--) {
                let random = Math.floor(Math.random() * res.length)
                arrayOfData.push({
                    id: res[i].id,
                    title: res[i].title,
                    story: res[i].story
                })
            }
        }
        let k=0, z=20
        for (let i=0; i<=arrayOfData.length/20; i++) { arrayTemp.push(arrayOfData.slice(k,z)), k+=20,z+=20 }
        const prev = `?p=${page-1}`
        const next = `?p=${parseInt(page)+1}`
        respond.render('index_stories.hbs', {arrayOfData: arrayTemp[page-1], prev: prev, next: next})
    })

    con.commit()
    con.end()
})

router.get('/stories:id', (req, respond) => {
    let id = req.params.id
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let arrayOfData = []
    con.query(`SELECT * FROM porn_stories WHERE id LIKE "${id}"`, (err, res) => {
        if (err) { console.log('selection error') }
        else {
            for (let i=0; i<res.length; i++) {
                arrayOfData.push({
                    id: res[i].id,
                    title: res[i].title,
                    story: res[i].story
                })
            }
        }
        respond.render('stories.hbs', {story: arrayOfData[0].story, id: arrayOfData[0].id, title: arrayOfData[0].title})
    })
})

router.get('/gifs', (req, respond) => {
    let find = req.query.search
    let page = req.query.p
    if (!page || page===0) page=1

    if (find) { sqlQuery = `SELECT * FROM gifs_data WHERE gif_desc LIKE '%${find}%';` }
    else { sqlQuery = 'SELECT * FROM gifs_data;' }
    
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let arrayOfData = []
    let arrayTemp = []
    con.query(sqlQuery, (err, res) => {
        if (err) { console.log('selection error') }
        else {
            for (let i=res.length-1; i>=0; i--) {
                let random = Math.floor(Math.random() * res.length)
                arrayOfData.push({
                    id: res[i].gif_id,
                    url: res[i].gif_url,
                    desc: res[i].gif_desc
                })
            }
        }
        let k=0, z=20
        for (let i=0; i<=arrayOfData.length/20; i++) { arrayTemp.push(arrayOfData.slice(k,z)), k+=20,z+=20 }
        const prev = `?p=${page-1}`
        const next = `?p=${parseInt(page)+1}`
        respond.render('index_gifs.hbs', {arrayOfData: arrayTemp[page-1], prev: prev, next: next})
    })

    con.commit()
    con.end()
})

router.get('/gif:id', (req, respond) => {
    const id = req.params.id
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let arrayOfData = []
    con.query(`SELECT * FROM gifs_data WHERE gif_id LIKE "${id}"`, (err, res) => {
        if (err) { console.log('selection error') }
        else {
            for (let i=0; i<res.length; i++) {
                arrayOfData.push({
                    id: res[i].gif_id,
                    url: res[i].gif_url,
                    desc: res[i].gif_desc
                })
            }
        }
        respond.render('gif.hbs', {url: arrayOfData[0].url, id: arrayOfData[0].id, desc: arrayOfData[0].desc})
    })
})

module.exports = router;