require('dotenv').config()

process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || 'postgresql://nandana@localhost/habit-tracker-test'

const { expect } = require('chai')
const supertest = require('supertest')


global.expect = expect;
global.supertest = supertest;