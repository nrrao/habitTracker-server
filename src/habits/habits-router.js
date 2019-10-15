const express = require('express');
const HabitsService = require('./habits-service');

const habitsRouter = express.Router();

habitsRouter
  .route('/:user_id')
  .all((req, res, next) => {
    HabitsService.getHabitsByUserId(req.app.get('db'), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: 'User does not exist' },
          });
        }
        res.user = user;
        next();
      });
  })
  .get((req, res) => {
    return res.json(res.user);
  });

module.exports = habitsRouter;