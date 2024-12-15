import { DataTypes, Model } from 'sequelize';
import sequelize from './database.js';


class User extends Model {
}

User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'user',
});

console.log(User === sequelize.models.User);

export default User;