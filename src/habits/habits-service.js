var moment = require('moment-timezone');

const HabitsService = {
  getAllDatesForHabit(db,habitId){
    const past = moment.tz('America/New_York').subtract(4,'days').format('YYYY-MM-DD')
    const now =  moment.tz('America/New_York').format()
    
    return db
    .from('habit_dates')
    .select('*')
    .where('habit_dates.habit_id',habitId)
    .whereBetween('date_added',[past,now])
    .orderBy('date_added','desc');

  },

  addHabitDate(db, newHabitId){
    
    //create array of dates
    const dates = [
      moment.tz('America/New_York').format(),
      moment.tz('America/New_York').subtract(1,'days').format(),
      moment.tz('America/New_York').subtract(2,'days').format(),
      moment.tz('America/New_York').subtract(3,'days').format(),
      moment.tz('America/New_York').subtract(4,'days').format(),
    ]

    console.log(dates);
    const datesToInsert = dates.map(date=>
      ({'percentage': 0, 'date_added':date, 'habit_id':newHabitId}))
    
    return db('habit_dates').insert(datesToInsert).returning('*')
  },

  getHabits(db, userId) {
 
    return db
      .from('habits')
      .select('*')
      .where('habits.user_id', userId)
      .orderBy('habit_id','desc')
      .then(habits=>{
        return Promise.all(habits.map(habit=>{
          return HabitsService.getAllDatesForHabit(db,habit.habit_id)
         .then(dates=>{
           for(let i=0; i<dates.length; i++) {
             dates[i].date_added = moment(dates[i].date_added).tz('America/New_York').format();
           }
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

  updateHabitTitle(db,habit_id,habit_title) {
    
    return db('habits')
    .where({habit_id:habit_id})
    .update({habit_title:habit_title})
    .then()
  },

  async addDateId(db,habitId,dates,habit_title,userId){
    console.log('+++++++',dates)
    dates.map(date=>{
      return db('habit_dates')
      .insert({percentage:date.percentage,date_added:date.date_added,habit_id:habitId})
      .then()
    }) 
    await HabitsService.updateHabitTitle(db,habitId,habit_title)
    return HabitsService.getHabits(db,userId)
  },

  deleteHabit(db, id) {
    return db('habits')
      .where({ habit_id:id })
      .del()
  },

  async deleteHabitDate(db, habitId,userId) {
    await db('habit_dates')
      .where({habit_id:habitId})
      .del()
      await HabitsService.deleteHabit(db,habitId)
      return HabitsService.getHabits(db, userId);
  },


  
};

module.exports = HabitsService;
