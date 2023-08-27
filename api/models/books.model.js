module.exports = (sequelize, Sequelize) => {
  const Books = sequelize.define("books", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    score: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return Books;
};
