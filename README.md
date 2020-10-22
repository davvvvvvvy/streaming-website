# streaming-website
🎬 Streaming website, video tube, upload GIFs too

## Installation

Download and install [NodeJS](https://nodejs.org/en/), [MySQL](https://www.mysql.com/).

Run
```bash
npm install
```

## Usage

First create database and tables, file "READY_SCRIPT.sql" or 

```SQL
CREATE DATABASE adult_website;

CREATE TABLE IF NOT EXISTS videos_data (
    video_id    INT NOT NULL    PRIMARY KEY,
    video_url   VARCHAR(255)    NOT NULL,
    video_title VARCHAR(255)    NOT NULL,
    video_thumb VARCHAR(255)    NOT NULL,
    video_desc  VARCHAR(255)    NOT NULL,
    video_tags  VARCHAR(255)    NOT NULL,
    users_id    INT             NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS gifs_data (
    gif_id      INT NOT NULL    PRIMARY KEY,
    gif_desc    VARCHAR(255),
    gif_url     VARCHAR(255),
	users_id    INT             NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS users (
    id          		INT             NOT NULL    PRIMARY KEY,
    username    		VARCHAR(255)    NOT NULL,
    email       		VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    password    		VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
	verification_code   VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
	flag                VARCHAR(100)    NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS porn_stories (
    id          INT             NOT NULL    PRIMARY KEY,
    title       LONGTEXT        NOT NULL,
    story       LONGTEXT        NOT NULL,
	users_id    INT             NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS comments (
	post_id         INT          NOT NULL,
	users_id        INT          NOT NULL,
	comment         LONGTEXT     NOT NULL
) ENGINE=INNODB;
```

Add to .js files password for root/user MySQL server
```javascript
let con = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: DATABASE
})
```

## Contact me for help

If you need some help, some error catched, add me on Telegram @IvekIvek
