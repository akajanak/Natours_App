const express = require('express');
const router = express.Router();
const tourController = require('./../Controllers/tourController');

// better api aliasings for routes
router
  .route('/top_5_cheap')
  .get(tourController.aliasRoute, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
// router.param('id', tourController.checkId);
router.route('/').get(tourController.getAllTours).post(tourController.newTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
