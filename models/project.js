module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'on_hold', 'completed'),
      allowNull: false,
      defaultValue: 'planned'
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
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

  return Project;
};