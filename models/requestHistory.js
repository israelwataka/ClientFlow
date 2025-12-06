module.exports = (sequelize, DataTypes) => {
  const RequestHistory = sequelize.define('RequestHistory', {
    requestId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    oldStatus: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    newStatus: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changedByUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  });

  return RequestHistory;
};