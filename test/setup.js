require('dotenv').config()

process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || 'postgresql://nandana@localhost/habit-tackertest'

const { expect } = require('chai')
const supertest = require('supertest')


global.expect = expect;
global.supertest = supertest;