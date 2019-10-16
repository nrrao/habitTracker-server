const express = require('express');
const HabitsService = require('./habits-service');
const { requireAuth } = require('../middleware/jwt-auth');

const habitsRouter = express.Router();

habitsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    HabitsService.getHabits(req.app.get('db'),req.user.id)
      .then(habits => {
        res.json(habits.map(HabitsService.serializeHabit));
      })
      .catch(next);
  });

module.exports = habitsRouter;