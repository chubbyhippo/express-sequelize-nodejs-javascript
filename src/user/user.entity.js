import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const UserEntity = sequelize.define('user', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  inactive: { type: DataTypes.BOOLEAN, defaultValue: true },
  activationToken: DataTypes.STRING,
});

UserEntity.beforeCreate((user) => {
  const saltRounds = 10;
  user.password = bcrypt.hashSync(user.password, saltRounds);
});

export default UserEntity;
