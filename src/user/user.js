import { DataTypes } from 'sequelize';
import sequelize from '../shared/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
});

User.beforeCreate((user) => {
  const saltRounds = 10;
  user.password = bcrypt.hashSync(user.password, saltRounds);
});

export default User;
