module.exports = (sequelize, DataTypes) => {
  const RequestComment = sequelize.define('RequestComment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requestId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    authorUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  });

  return RequestComment;
};