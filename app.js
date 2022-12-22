const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const errorController = require('./Controllers/errorController');
const AppErr = require('./utils/AppErr');
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
/** 
 * ! EXPRESS WAY OF DOING THINGS -- BASICS
 app.get('/', (req, res) => {
   res.status(200).json({
     message: 'hello from server using xpress',
     app: 'express natours',
    });
  });
  app.post('/', (req, res) => {
    res.send('using the post method');
  });
  
  const port = 8000;
  app.listen(port, () => {
    console.log(`listening to ${port}...`);
  });
*/
// TO READ DATA AS JSON FROM FILE AND RETURN IT ON DEFINED ROUTE

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppErr(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);
module.exports = app;
