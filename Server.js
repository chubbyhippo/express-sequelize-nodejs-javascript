import app from './src/App.js';
import sequelize from './src/shared/Database.js';
import console from 'node:console';

const port = 8080;

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Example app listening on port ${port}`);
});
