const { request } = require('../app');
const Tour = require('./../Models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppErr = require('../utils/appErr');

// *? HIDDEN CODE IS MIDDLEWARE TO CHECK DATA.JSON VALIDITY
// exports.checkId = (req, res, next, val) => {
//   console.log(`${val}`);
//   if (val > tours.length)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'data not found',
//     });
//   next();
// };
exports.aliasRoute = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = [
    'name',
    'price',
    'ratingsAverage',
    'summary',
    'difficulty',
  ];
  next();
};
exports.newTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  // const tours = await Tour.find();
  // FILTERING ( in APIFeatures class)
  // const queryObj = { ...req.query };
  // const excField = ['sort', 'page', 'limit', 'fields'];
  // excField.forEach((el) => delete queryObj[el]);
  // // ADVANCE FILTERING
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // let query = Tour.find(JSON.parse(queryStr));
  // SORTING QUERY
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query.sort(sortBy);
  // } else {
  //   query = query.sort('-startDates'); // descending order by giving (-) at variable
  // }
  // FIELD LIMITING
  // if (req.query.fields) {
  //   const fields = req.query.fields.toString().split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }
  // PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 1;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTour = Tour.countDocuments();
  //   if (skip >= numTour) throw new Error('this page doesnot exist');
  // }
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();
  const tours = await features.query;
  res.status(200).send({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // const tourVal = tours.find((el) => el.id === parseInt(req.params.id));
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppErr('No Tour Found With That ID', 404));
  }
  res.status(200).send({
    status: 'success',
    result: tour.length,
    data: {
      tour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppErr('No Tour Found With That ID', 404));
  }
  res.status(200).json({
    status: 'success',
    tour,
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = Tour.deleteOne(
    req.params.id,
    res.status(204).json({
      status: 'success',
      data: null,
    })
  );
  if (!tour) {
    return next(new AppErr('No Tour Found With That ID', 404));
  }
});
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { $id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseFloat(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
