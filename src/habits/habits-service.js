const moment = require('moment');

const HabitsService = {
  getAllDatesForHabit(db,habitId){
    const past = moment().subtract(4,'days').format('YYYY-MM-DD')
    return db
    .from('habit_dates')
    .select('*')
    .where('habit_dates.habit_id',habitId)
    .whereBetween('date_added',[past,'now()'])
    .orderBy('date_added','desc')
  },

  addHabitDate(db, newHabitId){
    //create array of dates
    const dates = [
      moment(),
      moment().subtract(1,'days'),
      moment().subtract(2,'days'),
      moment().subtract(3,'days'),
      moment().subtract(4,'days'),
    ]

    const datesToInsert = dates.map(date=>
      ({'percentage': 0, 'date_added':date, 'habit_id':newHabitId}))
    
    return db('habit_dates').insert(datesToInsert).returning('*')
  },

  getHabits(db, userId) {
    
    return db
      .from('habits')
      .select('*')
      .where('habits.user_id', userId)
      .orderBy('habit_id')
      .then(habits=>{
        return Promise.all(habits.map(habit=>{
         return HabitsService.getAllDatesForHabit(db,habit.habit_id)
         .then(dates=>{
           return{...habit,dates}
         })

        }))
      })
  },

  addHabit(db, newHabit) {
    return db
      .insert(newHabit)
      .into('habits')
      .returning('*')
      .then(newHabitObjArr=>HabitsService.addHabitDate(db,newHabitObjArr[0].habit_id))
      .then(()=>HabitsService.getHabits(db, newHabit.user_id));
  },

  async updateHabitDates(db,dates){
    dates.forEach(async (date) => {
      await db('habit_dates')
      .where({date_id:date.date_id})
      .update({percentage:date.percentage})
      .then()
    });
  },
  async updateHabit(db,habit_id,habit_title,dates,userId) {
      await db('habits')
      .where({habit_id:habit_id})
      .update({habit_title:habit_title})
      .then();

      await this.updateHabitDates(db, dates);
      
      return HabitsService.getHabits(db, userId);
  },

  deleteHabit(db, id) {
    return db('habits')
      .where({ habit_id:id })
      .del()
  },

  deleteHabitDate(db, habitId,userId) {
    return db('habit_dates')
      .where({habit_id:habitId})
      .del()
      .then(()=>HabitsService.deleteHabit(db,habitId))
      .then(()=>HabitsService.getHabits(db, userId));
  },

  serializeHabit(habit) {
    return {
      
      title: habit.habit_title,
      percentage:habit.dates.map(percentage=>percentage.percentage),
      habitId:habit.habit_id,
      date:habit.dates.map(date=>date.date_added)
      
    };
  },

  
};

module.exports = HabitsService;
