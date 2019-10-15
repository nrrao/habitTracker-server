const HabitsService ={
  
  getHabitsByUserId(db,id){
    return db
      .from('habits')
      .select('*')
      .where('habits.user_id',id)
      

  }
};

module.exports= HabitsService;