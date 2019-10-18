const moment = require('moment');

const HabitsService = {
  getAllDatesForHabit(db,habitId){
    return db
    .from('habit_dates')
    .select('*')
    .where('habit_dates.habit_id',habitId)
  },

  addHabitDate(db, newHabitId){
    let newHabitDate = {
      'percentage': 0,
      'date_added': 'now()',
      'habit_id': newHabitId
    };
    return db
      .insert(newHabitDate)
      .into('habit_dates')
      .returning('*')      
  },

  getHabits(db, id) {
    return db
      .from('habits')
      .select('*')
      .where('habits.user_id', id)
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
