const express = require('express');
const path = require('path');
const HabitsService = require('./habits-service');
const { requireAuth } = require('../middleware/jwt-auth');

const habitsRouter = express.Router();
const jsonBodyParser = express.json();

habitsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    HabitsService.getHabits(req.app.get('db'), req.user.id)
      .then(habits => {
        res.json(habits);
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { habit_title } = req.body;
    const newHabit = { habit_title };

    for (const [key, value] of Object.entries(newHabit))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newHabit.user_id = req.user.id;

    HabitsService.addHabit(req.app.get('db'), newHabit)
      .then(allHabits => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl))
          .json(allHabits);
      })
      .catch(next);
  })

  .patch(requireAuth,jsonBodyParser, (req, res, next) => {
    
    const {habit_title,user_id,habit_id}=req.body;
    const habitTitleToUpdate = {habit_title,user_id,habit_id};
    const numberOfValues = Object.values(habitTitleToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body must content either \'title\', \'style\' or \'content\''
        }
      });
    HabitsService.updateHabitTitle(req.app.get('db'),habitTitleToUpdate,req.user.id)
      .then(habitsAfterUpdate=>{
        res.status(201)
          
          .json(habitsAfterUpdate);
      })
      .catch(next);
  });
habitsRouter
  .route('/:habitId')
  .all(requireAuth)
  .delete(requireAuth, (req, res, next) => {
    HabitsService.deleteHabitDate(
      req.app.get('db'),
      req.params.habitId,req.user.id
    )
      .then(habitsAfterDelete => {
        res.status(201)
          .json(habitsAfterDelete);
      })
      .catch(next)
  })


module.exports = habitsRouter;
