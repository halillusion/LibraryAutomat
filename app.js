const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./api/models");

// sync db and insert initial data
if (process.env.DB_SYNC === "true") {
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Synced db.");
      // insert initial data
      const users = [
        {
          name: "Esin Öner",
        },
        {
          name: "Halil İbrahim Erçelik",
        },
      ];
      db.users.bulkCreate(users).then(() => {
        console.log("Inserted users.");
      });
      const books = [
        {
          name: "Neuromancer",
        },
        {
          name: "The Lord of the Rings",
        },
        {
          name: "1984",
        },
      ];
      db.books.bulkCreate(books).then(() => {
        console.log("Inserted books.");
      });
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
}

// simple route
app.get("/", (req, res) => {
  res.json({
    name: "Library Automat",
    version: "1.0.0",
  });
});

// api routes
require("./api/routes/users.routes")(app);
require("./api/routes/books.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
