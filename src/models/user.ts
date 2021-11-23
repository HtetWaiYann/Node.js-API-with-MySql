import { Sequelize } from 'sequelize';
import sequelize from '../sequelize';

// Model for user table
const userModel = (sequelize: any, Sequelize: any) => {
  const users = sequelize.define('users', {
    _id: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    }
  });

  return users;
};


const userTable: any = {};
userTable.Sequelize = Sequelize;
userTable.sequelize = sequelize;

//create model
userTable.services = userModel(sequelize, Sequelize);

module.exports = userTable;
