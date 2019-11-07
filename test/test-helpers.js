const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

getDatesArray = () => {
  const dates = [
    moment.tz('America/New_York'),
    moment.tz('America/New_York').subtract(1,'days'),
    moment.tz('America/New_York').subtract(2,'days'),
    moment.tz('America/New_York').subtract(3,'days'),
    moment.tz('America/New_York').subtract(4,'days'),
  ];
  return dates;
}

function makeUsersArray(){
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
      
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
      
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password',
      
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
      
    },
  ];
}

function makeHabitsArray(users){
  return[
    {
      habit_id:1,
      habit_title:'habit1',
      user_id:users[0].id,
    },
    {
      habit_id:2,
      habit_title:'habit2',
      user_id:users[1].id,
    },
    {
      habit_id:3,
      habit_title:'habit3',
      user_id:users[2].id,
    },
    {
      habit_id:4,
      habit_title:'habit4',
      user_id:users[3].id,
    },
    {
      habit_id:5,
      habit_title:'habit5',
      user_id:users[0].id,
    },
  ];
}

function makeHabitDatesArray(habits){
  return [
    {
      date_id:1,
      percentage:80,
      date_added: new Date(getDatesArray()[0].format()),
      habit_id:habits[0].habit_id,
    },
    {
      date_id:2,
      percentage:80,
      date_added: new Date(getDatesArray()[1].format()),
      habit_id:habits[1].habit_id,
    },
    {
      date_id:3,
      percentage:80,
      date_added: new Date(getDatesArray()[2].format()),
      habit_id:habits[2].habit_id,
    },
    {
      date_id:4,
      percentage:80,
      date_added: new Date(getDatesArray()[3].format()),
      habit_id:habits[3].habit_id,
    },
    {
      date_id:5,
      percentage:80,
      date_added: new Date(getDatesArray()[4].format()),
      habit_id:habits[0].habit_id,
    },
    {
      date_id:6,
      percentage:80,
      date_added: new Date(getDatesArray()[0].format()),
      habit_id:habits[2].habit_id,
    },
  ];
}

function makeExpectedHabitlist(userId, habits, dates) {
  const habitList= habits
   .filter(habit => habit.user_id === userId)
   const retList = habitList.map(eachHabit=>{
     const habitDate=dates.filter(date=>date.habit_id===eachHabit.habit_id)
     return{
       habit_id:eachHabit.habit_id,
       habit_title:eachHabit.habit_title,
       user_id:eachHabit.user_id,
       dates:habitDate.map(hd => { 
        return {
          date_id:hd.date_id,
          percentage:hd.percentage,
          date_added:moment(hd.date_added).tz('America/New_York').format(),
          //date_added:hd.date_added.toISOString(),
          habit_id:eachHabit.habit_id
        }
      })
     }
   });
   return(retList.sort((a,b)=>b.habit_id-a.habit_id));
}

function makeHabitsFixtures() {
  const testUsers = makeUsersArray();
  const testHabits = makeHabitsArray(testUsers);
  const testDates = makeHabitDatesArray(testHabits);
  return { testUsers, testHabits, testDates };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        habits
        habits_users,
        habit_dates
      `
    )
      .then(() =>
        Promise.all([
          trx.raw('ALTER SEQUENCE habits_habit_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE habits_users_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE habit_dates_date_id_seq minvalue 0 START WITH 1'),
          trx.raw('SELECT setval(\'habits_habit_id_seq\', 0)'),
          trx.raw('SELECT setval(\'habits_users_id_seq\', 0)'),
          trx.raw('SELECT setval(\'habit_dates_date_id_seq\', 0)'),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('habits_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('habits_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

// function seedHabitsTables(db, users, habits, habitDates=[]) {
//   // use a transaction to group the queries and auto rollback on any failure
//   return db.transaction(async trx => {
//     await seedUsers(trx, users)
//     await trx.into('habits').insert(habits)
//     // update the auto sequence to match the forced id values
//     await trx.raw(
//       `SELECT setval('habits_habit_id', ?)`,
//       [habits[habits.length - 1].habit_id],
//     )
//       await trx.into('habit_dates').insert(habitDates)
//       await trx.raw(
//         `SELECT setval('habit_dates_date_id', ?)`,
//         habiDates[habitDates.length - 1].date_id],
//       )
    
//   })
// }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}


module.exports={
  makeUsersArray,
  makeHabitsArray,
  makeHabitDatesArray,
  makeExpectedHabitlist,
  makeHabitsFixtures,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  //seedHabitsTables,
}





// function seedHabitsTables(db, users, habits) {
//   // use a transaction to group the queries and auto rollback on any failure
//   return db.transaction(async trx => {
//     await seedUsers(trx, users)
//     await trx.into('habits').insert(habit)
//     // update the auto sequence to match the forced id values
//     await trx.raw(
//       `SELECT setval('habits_id_seq, ?)`,
//       [habits[articles.length - 1].id],
//     )
 
//   })
// }

