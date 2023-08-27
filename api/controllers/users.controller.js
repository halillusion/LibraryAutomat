const db = require("../models");
const Users = db.users;
const Relations = db.relations;
const Books = db.books;
const Op = db.Sequelize.Op;
const Joi = require("joi");

const getUserRecords = async (userId) => {
  const relations = await Relations.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["book_id", "user_id", "score", "created_at", "updated_at"],
  });

  // get books
  const bookIds = relations.map((relation) => relation.book_id);
  const books = await Books.findAll({
    where: {
      id: {
        [Op.in]: bookIds,
      },
    },
    attributes: ["id", "name", "score"],
  });

  // map books
  const bookMap = {};
  books.forEach((book) => {
    bookMap[book.id] = book;
  });

  // map relations to books
  const relationMap = {};
  relations.forEach((relation) => {
    if (!relationMap[relation.user_id]) {
      relationMap[relation.user_id] = [];
    }
    relationMap[relation.user_id].push(relation);
  });

  let records = [];

  if (relationMap[userId]) {
    records = relationMap[userId].map((relation) => {
      let totalTime =
        (relation.updated_at
          ? relation.updated_at - relation.created_at
          : new Date() - relation.created_at) / 1000;

      // day, hour, minute, second
      totalTime =
        Math.floor(totalTime / 86400) +
        "d " +
        Math.floor((totalTime % 86400) / 3600) +
        "h " +
        Math.floor(((totalTime % 86400) % 3600) / 60) +
        "m " +
        Math.floor(((totalTime % 86400) % 3600) % 60) +
        "s";

      return {
        book_id: relation.book_id,
        book: bookMap[relation.book_id].name,
        score: relation.score,
        created_at: relation.created_at,
        updated_at: relation.updated_at,
        total_time: totalTime,
      };
    });
  }

  return records;
};

// retrieve all users from the database.
exports.findAll = (req, res) => {
  Users.findAll()
    .then(async (data) => {
      if (data.length === 0) {
        return res.status(404).send({
          warning: `Cannot find any user.`,
        });
      }

      const result = [];
      for (let i = 0; i < data.length; i++) {
        const user = data[i];
        // const records = await getUserRecords(user.id);
        result.push({
          id: user.id,
          name: user.name,
          // records: records,
        });
      }

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};

// find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // validation
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  const { error } = schema.validate({ id: id });

  if (error) {
    res.status(400).send({
      error: error.details[0].message,
    });
    return;
  }

  Users.findByPk(id)
    .then(async (data) => {
      if (data) {
        // get user records
        const records = await getUserRecords(id);
        res.send({
          // id: data.id,
          name: data.name,
          records: records,
        });
      } else {
        res.status(404).send({
          warning: `Cannot find user with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: "Error retrieving user with id=" + id,
      });
    });
};

// create and save user
exports.create = (req, res) => {
  // validate request
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({
      error: error.details[0].message,
    });
    return;
  }

  // check if user already exists
  Users.findOne({
    where: {
      name: req.body.name,
    },
  })
    .then((data) => {
      if (data) {
        res.status(400).send({
          warning: "User already exists",
        });
      } else {
        // save user in the database
        Users.create({
          name: req.body.name,
        })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              error:
                err.message || "Some error occurred while creating the user.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message || "Some error occurred while creating the user.",
      });
    });
};

// borrow book
exports.borrowBook = async (req, res) => {
  const user_id = req.params.user_id;
  const book_id = req.params.book_id;

  // validation
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required(),
  });

  const { error } = schema.validate({ user_id: user_id, book_id: book_id });

  if (error) {
    res.status(400).send({
      error: error.details[0].message,
    });
    return;
  }

  // check if user exists
  const user = await Users.findByPk(user_id);
  if (!user) {
    return res.status(404).send({
      warning: `Cannot find user with id=${user_id}.`,
    });
  }

  // check if book exists
  const book = await Books.findByPk(book_id);
  if (!book) {
    return res.status(404).send({
      warning: `Cannot find book with id=${book_id}.`,
    });
  }

  // check if book is already borrowed or not returned
  const relation = await Relations.findAll({
    where: {
      book_id: book_id,
      updated_at: null,
    },
  });

  if (relation.length > 0) {
    return res.status(400).send({
      warning: "Book is already borrowed",
      relation: relation,
    });
  }

  // borrow book
  Relations.create({
    user_id: user_id,
    book_id: book_id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message || "Some error occurred while borrowing the book.",
      });
    });
};

// return book
exports.returnBook = async (req, res) => {
  const user_id = req.params.user_id;
  const book_id = req.params.book_id;
  const score = req.body.score;

  // validation
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required(),
    score: Joi.number().integer().min(1).max(10).required(),
  });

  const { error } = schema.validate({
    user_id: user_id,
    book_id: book_id,
    score: score,
  });

  if (error) {
    res.status(400).send({
      error: error.details[0].message,
    });
    return;
  }

  // check if user exists
  const user = await Users.findByPk(user_id);
  if (!user) {
    return res.status(404).send({
      warning: `Cannot find user with id=${user_id}.`,
    });
  }

  // check if book exists
  const book = await Books.findByPk(book_id);
  if (!book) {
    return res.status(404).send({
      warning: `Cannot find book with id=${book_id}.`,
    });
  }

  // check if book is borrowed
  const relation = await Relations.findAll({
    where: {
      user_id: user_id,
      book_id: book_id,
      updated_at: null,
    },
  });

  if (relation.length === 0) {
    return res.status(400).send({
      warning: "Book is not borrowed",
    });
  }

  // return book
  Relations.update(
    {
      score: score,
      updated_at: new Date(),
    },
    {
      where: {
        user_id: user_id,
        book_id: book_id,
        updated_at: null,
      },
    }
  ).then(async (data) => {
    if (data[0] === 0) {
      return res.status(400).send({
        warning: "Book is not borrowed",
      });
    }
    // calculate average score
    const averageScore = await Relations.findAll({
      attributes: [
        [db.sequelize.fn("AVG", db.sequelize.col("score")), "averageScore"],
      ],
      where: {
        book_id: book_id,
      },
    });

    // update book score
    await Books.update(
      {
        score: averageScore[0].dataValues.averageScore,
      },
      {
        where: {
          id: book_id,
        },
      }
    );

    res.send(data);
  });
};
