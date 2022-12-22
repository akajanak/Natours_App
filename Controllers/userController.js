const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const Users = await User.find({ email });
  res.status(200).send({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
  next();
});
exports.getUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'requested user data is here ...',
  });
};
exports.newUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'new user data couldnot be added...',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'user data updated successfully ...',
    //   'result': tours.length,
    //   'data': {
    //     tours,
    //   },
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'user data updated successfully',
  });
};
