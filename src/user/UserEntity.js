import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';
import bcrypt from 'bcrypt';

const UserEntity = sequelize.define('user', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
});

UserEntity.beforeCreate((user) => {
  const saltRounds = 10;
  user.password = bcrypt.hashSync(user.password, saltRounds);
});

export default UserEntity;
