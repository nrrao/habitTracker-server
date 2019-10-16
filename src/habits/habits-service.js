const HabitsService ={
  
  getHabits(db,id){
    return db
      .from('habits')
      .select('*')
      .where('habits.user_id',id)
  },

  serializeHabit(habit) {
    return {
      title: habit.habit_title,
      percentage: habit.percentage
    };
  }
};

module.exports= HabitsService;