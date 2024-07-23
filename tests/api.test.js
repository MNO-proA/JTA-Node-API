// Create a new file: tests/api.test.js

const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/jta/api', routes);

let authToken;

beforeAll(async () => {
  const response = await request(app)
    .post('/jta/api/token')
    .send({ username: process.env.API_USERNAME, password: process.env.API_PASSWORD });
  authToken = response.body.access_token;
});

describe('Staff API', () => {
  let staffId;

  test('POST /staff - Create new staff', async () => {
    const response = await request(app)
      .post('/jta/api/staff')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        staffID: 'test001',
        fullName: 'Test User',
        employmentType: 'Full-time',
        jobTitle: 'Nurse',
        hourlyRate: 25.5
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Staff created successfully');
    staffId = 'test001';
  });

  test('GET /staff - Get all staff', async () => {
    const response = await request(app)
      .get('/jta/api/staff')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /staff/:staffId - Get single staff', async () => {
    const response = await request(app)
      .get(`/jta/api/staff/${staffId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.staffID).toBe(staffId);
  });

  test('PUT /staff/:staffId - Update staff', async () => {
    const response = await request(app)
      .put(`/jta/api/staff/${staffId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        updates: {
          jobTitle: 'Senior Nurse',
          hourlyRate: 30.0
        }
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.jobTitle).toBe('Senior Nurse');
    expect(response.body.hourlyRate).toBe(30.0);
  });

  test('DELETE /staff/:staffId - Delete staff', async () => {
    const response = await request(app)
      .delete(`/jta/api/staff/${staffId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Staff deleted successfully');
  });
});

describe('Shifts API', () => {
  let staffId = 'test002';
  let startDate = '2023-07-17';

  test('POST /shifts - Create new shift', async () => {
    const response = await request(app)
      .post('/jta/api/shifts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        staffID: staffId,
        startDate: startDate,
        endDate: '2023-07-18',
        house: 'House A',
        shift: 'Night',
        shiftStart: '22:00',
        shiftEnd: '06:00',
        overtime: 1,
        totalHours: 9,
        totalWage: 270,
        absence: 'No',
        absenceStatus: 'N/A'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Shift created successfully');
  });

  test('GET /shifts - Get all shifts', async () => {
    const response = await request(app)
      .get('/jta/api/shifts')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /shifts/:staffId/:startDate - Get single shift', async () => {
    const response = await request(app)
      .get(`/jta/api/shifts/${staffId}/${startDate}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.staffID).toBe(staffId);
    expect(response.body.startDate).toBe(startDate);
  });

  test('PUT /shifts/:staffId/:startDate - Update shift', async () => {
    const response = await request(app)
      .put(`/jta/api/shifts/${staffId}/${startDate}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        updates: {
          overtime: 2,
          totalHours: 10,
          totalWage: 300
        }
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.overtime).toBe(2);
    expect(response.body.totalHours).toBe(10);
    expect(response.body.totalWage).toBe(300);
  });

  test('DELETE /shifts/:staffId/:startDate - Delete shift', async () => {
    const response = await request(app)
      .delete(`/jta/api/shifts/${staffId}/${startDate}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Shift deleted successfully');
  });
});

describe('Expenses API', () => {
  let expenseId = 'exp001';
  let date = '2023-07-17';

  test('POST /expense - Create new expense', async () => {
    const response = await request(app)
      .post('/jta/api/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        expenseID: expenseId,
        date: date,
        youngPersonWeeklyMoney: 50,
        maintenance: 100,
        IT: 75,
        misc: 25,
        pettyCash: 30,
        general: 200
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Expense created successfully');
  });

  test('GET /expenses - Get all expenses', async () => {
    const response = await request(app)
      .get('/jta/api/expenses')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /expense/:expenseId/:date - Get single expense', async () => {
    const response = await request(app)
      .get(`/jta/api/expense/${expenseId}/${date}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.expenseID).toBe(expenseId);
    expect(response.body.date).toBe(date);
  });

  test('PUT /expense/:expenseId/:date - Update expense', async () => {
    const response = await request(app)
      .put(`/jta/api/expense/${expenseId}/${date}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        updates: {
          maintenance: 150,
          misc: 50
        }
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.maintenance).toBe(150);
    expect(response.body.misc).toBe(50);
  });

  test('DELETE /expense/:expenseId/:date - Delete expense', async () => {
    const response = await request(app)
      .delete(`/jta/api/expense/${expenseId}/${date}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Expense deleted successfully');
  });
});
