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
    const {habit_id,habit_title,dates}=req.body;
    const habitToUpdate= {habit_id,habit_title,dates};
   
    const numberOfValues = Object.values(req.body).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body must content either \'title\', \'style\' or \'content\''
        }
      });
    const datesToAdd = habitToUpdate.dates.filter(date =>{return date.date_id === -1;});

    const datesToUdate = habitToUpdate.dates.filter(date =>{return date.date_id > -1;});
    
    if(datesToAdd.length !== 0){
      HabitsService.addDateId(req.app.get('db'),habitToUpdate.habit_id,datesToAdd,habitToUpdate.habit_title,req.user.id)
        .then(habitsAfterUpdate=>{
          res.status(201)
          
            .json(habitsAfterUpdate);
        })
        .catch(next);
    }

    if(datesToUdate.length !== 0) {
      HabitsService.updateHabit(req.app.get('db'),habitToUpdate.habit_id,habitToUpdate.habit_title,datesToUdate,req.user.id)
        .then(habitsAfterUpdate=>{
          res.status(201)
          
            .json(habitsAfterUpdate);
        })
        .catch(next);
    }
    
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
      .catch(next);
  });


module.exports = habitsRouter;
