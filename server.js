const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connection succeded');
  });
const server = app.listen(8000, () => {
  console.log('listening to the port 8000 now...');
});
process.on('uncaughtException', (err) => {
  console.log('uncaught exception, exiting', err);
  server.close(() => process.exit(1));
});
process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection, shutting down', err);
  server.close(() => process.exit(1));
});
