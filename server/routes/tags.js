const mysql = require('mysql')
const express = require('express')
let router = express.Router()

const DATABASE = 'adult_website'

router.get('/categories', (req, res) => {
    res.render('categories.hbs')
})

router.get('/categories/:tag', (req, respond) => {
    let tag = req.params.tag
    let page = req.query.p
    if (!page || page===0) page=1

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: DATABASE
    })

    let TAG = tag
    tag = tag.replace(' ', '%')

    let arrayOfData = []
    let arrayTemp = []
    con.query(`SELECT * FROM videos_data WHERE video_tags LIKE "%${tag}%";`, (err, res) => {
        if (err) { console.log(err) }
        else {
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
        let k=0, z=20
        for (let i=0; i<=arrayOfData.length/20; i++) { arrayTemp.push(arrayOfData.slice(k,z)), k+=20,z+=20 }
        const prev = `?p=${page-1}`
        const next = `?p=${parseInt(page)+1}`
        respond.render('category.hbs', {arrayOfData: arrayTemp[page-1], prev: prev, next: next, tag: TAG})
     })
})

module.exports = router;