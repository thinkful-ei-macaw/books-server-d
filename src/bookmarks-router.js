const express = require('express')
const uuid = require('uuid/v4')
const bookmarks = require('./store')
const bookmarksRouter = express.Router()
const bodyParser = express.json()

const {isWebUri} = require('valid-url')

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    // console.log("req.body is ", req.body);
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        //logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { title, url, description, rating } = req.body
    console.log(title,url,description,rating)

    if (!Number.isInteger(rating) || rating <0 || rating >5) {
      // logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    if (!isWebUri(url)) {
      //logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }

    const bookmark = { id: uuid(), title, url, description, rating }

    bookmarks.push(bookmark)

    // logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:7000/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res) => {
    const { bookmark_id } = req.params

    const bookmark = bookmarks.find(c => c.id == bookmark_id)

    if (!bookmark) {
    //   logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params

    const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmark_id)

    if (bookmarkIndex === -1) {
    //   logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    bookmarks.splice(bookmarkIndex, 1)

    // logger.info(`Bookmark with id ${bookmark_id} deleted.`)
    res
      .status(204)
      .end()
  })

module.exports = bookmarksRouter