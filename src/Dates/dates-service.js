const DatesService = {

  getHabitDates(db, userId) {
    return db
    //SELECT * FROM habit_dates HD JOIN habits H ON HD.habit_id = H.habit_id WHERE H.user_id=1
      .from('habit_dates AS HD')
      .select('H.habit_title','H.habit_id','HD.date_id','HD.percentage','HD.date_added')  
      .join('habits AS H', 'HD.habit_id', '=', 'H.habit_id')
      .where('H.user_id','=', userId)
      .orderBy('HD.date_added','desc');
      
  },

  // addHabit(db, newHabit) {
  //   return db
  //     .insert(newHabit)
  //     .into('habits')
  //     .returning('*')
  //     .then(({ habit }) => habit)
  //     .then(habit => HabitsService.addHabitDate(newHabit, 0, now()))
  //     .then(habit => HabitsService.getHabits(db, newHabit.user_id));
  // },

  addHabitDate(db, newHabitId){
    return db
      .insert(0, 'now()',newHabitId)
      .into('habit_dates')
      .returning('*')
      .then(({ habit }) => habit);
      
  },

  serializeHabitDate(habitDate){
   
    return{
      id:habitDate.date_id,
      title:habitDate.habit_title,
      percentage:habitDate.percentage,
      habitId:habitDate.habit_id,
      date:habitDate.date_added

    };
  },

};

module.exports = DatesService;
