const express = require('express');
const path = require('path');
const DatesService = require('./dates-service');
const { requireAuth } = require('../middleware/jwt-auth');

const datesRouter = express.Router();
const jsonBodyParser = express.json();

datesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    DatesService.getHabitDates(req.app.get('db'), req.user.id)
      .then(habitdates => {
        // const groupBy = key => array => 
        //   array.reduce((objectsByKeyValue, obj) => {
        //     const value = obj[key];
        //     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        //     return objectsByKeyValue;
        //   }, {});
        
        // const groupByHabitId = groupBy('title');
        res.json(((habitdates.map(DatesService.serializeHabitDate))));
      })

      .catch(next);
  });

module.exports = datesRouter;
