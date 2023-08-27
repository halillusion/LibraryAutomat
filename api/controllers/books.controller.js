const db = require("../models");
const Users = db.users;
const Relations = db.relations;
const Books = db.books;
const Op = db.Sequelize.Op;
const Joi = require("joi");

const getRecords = async (bookId) => {
  const relations = await Relations.findAll({
    where: {
      book_id: bookId,
    },
    attributes: ["book_id", "user_id", "score", "created_at", "updated_at"],
  });

  // get users
  const userIds = relations.map((relation) => relation.user_id);
  const users = await Users.findAll({
    where: {
      id: {
        [Op.in]: userIds,
      },
    },
    attributes: ["id", "name"],
  });

  // map users
  const userMap = {};
  users.forEach((user) => {
    userMap[user.id] = user.name;
  });

  // map relations to books
  const relationMap = {};
  relations.forEach((relation) => {
    if (!relationMap[relation.book_id]) {
      relationMap[relation.book_id] = [];
    }
    relationMap[relation.book_id].push(relation);
  });

  let records = [];

  if (relationMap[bookId]) {
    records = relationMap[bookId].map((relation) => {
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
        user_id: relation.user_id,
        user_name: userMap[relation.user_id],
        score: relation.score,
        total_time: totalTime,
        reclaimed: relation.updated_at ? true : false,
        created_at: relation.created_at,
        updated_at: relation.updated_at,
      };
    });
  }

  return records;
};

// retrieve all books from the database.
exports.findAll = (req, res) => {
  Books.findAll({
    attributes: ["id", "name", "score"],
  })
    .then(async (data) => {
      if (data.length === 0) {
        return res.status(404).send({
          warning: "No books found in the library.",
        });
      }

      const result = [];
      for (let i = 0; i < data.length; i++) {
        const book = data[i];
        // const records = await getRecords(book.id);
        result.push({
          id: book.id,
          name: book.name,
          score: book.score,
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

// find a single book with an id
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

  Books.findByPk(id)
    .then(async (data) => {
      if (data) {
        const records = await getRecords(data.id);
        res.send({
          id: data.id,
          name: data.name,
          score: data.score,
          records: records,
        });
      } else {
        res.status(404).send({
          warning: `Cannot find book with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: "Error retrieving book with id=" + id,
      });
    });
};

// create and save book
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

  // check if book already exists
  Books.findOne({
    where: {
      name: req.body.name,
    },
  })
    .then((data) => {
      if (data) {
        res.status(400).send({
          warning: "Book already exists",
        });
      } else {
        // save book in the database
        Books.create({
          name: req.body.name,
        })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              error:
                err.message || "Some error occurred while creating the book.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message || "Some error occurred while creating the book.",
      });
    });
};
