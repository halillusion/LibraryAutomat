module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // get all users
  router.get("/", users.findAll);

  // retrieve a single user with id
  router.get("/:id", users.findOne);

  // create user
  router.post("/", users.create);

  // borrow book
  router.post("/:user_id/borrow/:book_id", users.borrowBook);

  // return book
  router.post("/:user_id/return/:book_id", users.returnBook);

  app.use("/users", router);
};
