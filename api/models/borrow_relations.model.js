module.exports = (sequelize, Sequelize) => {
  const BorrowRelations = sequelize.define("borrow_relations", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    book_id: {
      type: Sequelize.INTEGER,
    },
    score: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  return BorrowRelations;
};
