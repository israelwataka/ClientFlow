module.exports = (sequelize, DataTypes) => {
  const RequestAttachment = sequelize.define('RequestAttachment', {
    requestId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: false
    }
  });

  return RequestAttachment;
};