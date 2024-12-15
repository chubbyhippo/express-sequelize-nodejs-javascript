import app from './src/app.js';
import User from './src/user.js';

const port = 8080;

app.listen(port, async () => {
  await User.sync({ force: true });
  console.log(`Example app listening on port ${port}`);
});
