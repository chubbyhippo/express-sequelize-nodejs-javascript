import app from './src/app.js';
import sequelize from './src/shared/database.js';
import console from 'node:console';

const port = 8080;

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Example app listening on port ${port}`);
});
