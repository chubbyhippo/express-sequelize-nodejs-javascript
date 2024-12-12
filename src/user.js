import Sequelize from 'sequelize';
import sequelize from './database';

const Model = Sequelize.Model;

class User extends Model {}

User.init({
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
}, {
  sequelize,
  modelName: 'user',
})

export default User;