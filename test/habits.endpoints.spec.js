const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const moment = require('moment-timezone');

describe('Habits Endpoints', function() {
  let db;
  const {
    testUsers,
    testHabits,
    testDates,
  } = helpers.makeHabitsFixtures();
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE habits,habits_users,habit_dates RESTART IDENTITY CASCADE'));
  afterEach('cleanup', () => db.raw('TRUNCATE habits,habits_users,habit_dates RESTART IDENTITY CASCADE'));

  describe('GET /api/habits', () => {
    context('Given no habits in the database', () => {
      beforeEach(() =>
        db.into('habits_users').insert(testUsers)
      );
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });

    });

    context('Given habits in the database', () => {
      beforeEach(() =>
        db.into('habits_users').insert(testUsers)
          .then(()=>{
            return db.into('habits')
              .insert(testHabits)
              .then(()=>{
                return db.into('habit_dates')
                  .insert(testDates);
              });
          })
      );
      it('responds with 200 and habit list', () => {
        const userId=testUsers[0].id;
        const expectedHabitList=helpers.makeExpectedHabitlist(userId,testHabits,testDates);

        return supertest(app)
          .get('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200,expectedHabitList );
      });

    });
  });

  describe('Post/api/habits',()=>{
    beforeEach(() =>
      db.into('habits_users').insert(testUsers));
    
    it('creates new habit,responding with 201 and habitlist with new habit',()=>{
      const userId=testUsers[0].id;
      //const expectedHabitList=helpers.makeExpectedHabitlist(userId,testHabits,testDates);
      const newHabit={
        habit_title:'Test new Habit',
        user_id:userId,
      };
      return supertest(app)
        .post('/api/habits')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newHabit)
        .expect(201)
        .expect(res=>{
          expect(res.body[0]).to.have.property('habit_id');
          expect(res.body[0].habit_title).to.eql(newHabit.habit_title);
          expect(res.body[0].user_id).to.eql(userId);
        })
        .expect(res=>
          db
            .from('habits')
            .select('*')
            .where({habit_id:res.body[0].habit_id})
            .first()
            .then(row=>{
              expect(row.habit_title).to.eql(newHabit.habit_title);
            }));
    });

  });

  describe('DELETE /api/habits/:habitId', () => {
   
    context('Given there are habiits in the database', () => {
      
      beforeEach(() =>
        db.into('habits_users').insert(testUsers)
          .then(()=>{
            return db.into('habits')
              .insert(testHabits)
              .then(()=>{
                return db.into('habit_dates')
                  .insert(testDates);
              });
          })
      );
      it('responds with 201 and removes the habit', () => {
        const userId=testUsers[0].id;
        const expectedHabitList=helpers.makeExpectedHabitlist(userId,testHabits,testDates);
        const idToRemove = 5;
        const expectedHabits = expectedHabitList.filter(habit => habit.habit_id !== idToRemove);
        return supertest(app)
          .delete(`/api/habits/${idToRemove}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(201)
          .then(res =>
            supertest(app)
              .get('/api/habits')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedHabits)
          );
      });
    });
  });


  describe('PATCH /api/habits', () =>{

    context('Given there are habits in the database',()=>{
      beforeEach(() =>
        db.into('habits_users').insert(testUsers)
          .then(()=>{
            return db.into('habits')
              .insert(testHabits)
              .then(()=>{
                return db.into('habit_dates')
                  .insert(testDates);
              });
          })
      );
      it('responds with 201 and updates the article', () => {
        const userId=testUsers[0].id;
        const expectedHabitList=helpers.makeExpectedHabitlist(userId,testHabits,testDates);
        const updateHabit = {
          habit_id:1,
          habit_title:'updated habit title',
          dates:[    {
            date_id:1,
            percentage:80,
            date_added: moment.tz('America/New_York').format(),
          },
          {
            date_id:5,
            percentage:80,
            date_added: moment.tz('America/New_York').subtract(4,'days').format(),
            
          },]
        };

        const expectedHabit = expectedHabitList.map(hl=>
          hl.habit_id===updateHabit.habit_id
          ?{...hl,habit_title:updateHabit.habit_title}
          :hl
          )

           return supertest(app)
          .patch('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(updateHabit)
          .expect(201)
          .then(res =>
            supertest(app)
              .get('/api/habits')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedHabit)
          );
      });

    });
  });

});