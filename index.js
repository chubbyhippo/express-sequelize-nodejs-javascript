import app from './app'
import console from 'node:console';

const port = 3000

app.listen(3000)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
