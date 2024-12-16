import { Sequelize } from 'sequelize';
import config from 'config';

const sequelize = new Sequelize(config.get('database'));

export default sequelize;