import { DataTypes } from 'sequelize';
import sequelize from './database.js';

const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
});

export default User;