const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  ]
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
  ];
}

function makeDatesArray(habits){
  [
    {
      date_id:1,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[0].habit_id,
    },
    {
      date_id:2,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[1].habit_id,
    },
    {
      date_id:3,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[2].habit_id,
    },
    {
      date_id:1,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[3].habit_id,
    },
    {
      date_id:1,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[0].habit_id,
    },
    {
      date_id:1,
      percentage:80,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
      habit_id:habits[2].habit_id,
    },
  ];
}

// function makeExpectedHabitlist(users, habits, dates=[]) {
//   const author = users
//     .find(user => user.id === article.author_id)

//   const number_of_comments = comments
//     .filter(comment => comment.article_id === article.id)
//     .length

//   return {
//     id: article.id,
//     style: article.style,
//     title: article.title,
//     content: article.content,
//     date_created: article.date_created.toISOString(),
//     number_of_comments,
//     author: {
//       id: author.id,
//       user_name: author.user_name,
//       full_name: author.full_name,
//       nickname: author.nickname,
//       date_created: author.date_created.toISOString(),
//       date_modified: author.date_modified || null,
//     },
//   }
}