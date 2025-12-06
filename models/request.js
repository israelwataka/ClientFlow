module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'in_review', 'approved', 'rejected', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    responsibleUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return Request;
};