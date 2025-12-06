const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserModel = require('./user');
const ClientModel = require('./client');
const ProjectModel = require('./project');
const RequestModel = require('./request');
const PaymentModel = require('./payment');

const User = UserModel(sequelize, DataTypes);
const Client = ClientModel(sequelize, DataTypes);
const Project = ProjectModel(sequelize, DataTypes);
const Request = RequestModel(sequelize, DataTypes);
const Payment = PaymentModel(sequelize, DataTypes);

// Associations
Client.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Client.hasMany(Request, { foreignKey: 'clientId', as: 'requests' });
Request.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Project.hasMany(Request, { foreignKey: 'projectId', as: 'requests' });
Request.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Client.hasMany(Payment, { foreignKey: 'clientId', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Project, { foreignKey: 'responsibleUserId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'responsibleUserId', as: 'responsible' });

User.hasMany(Request, { foreignKey: 'responsibleUserId', as: 'assignedRequests' });
Request.belongsTo(User, { foreignKey: 'responsibleUserId', as: 'responsible' });

module.exports = {
  sequelize,
  User,
  Client,
  Project,
  Request,
  Payment
};