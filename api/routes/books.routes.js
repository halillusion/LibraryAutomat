module.exports = (app) => {
  const books = require("../controllers/books.controller.js");

  var router = require("express").Router();

  // get all books
  router.get("/", books.findAll);

  // retrieve a single book with id
  router.get("/:id", books.findOne);

  // create book
  router.post("/", books.create);

  app.use("/books", router);
};
