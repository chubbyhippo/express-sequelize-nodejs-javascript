import app from './src/App';
import sequelize from './src/config/Database';
import console from 'node:console';

const port = 8080;

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Example app listening on port ${port}`);
});
