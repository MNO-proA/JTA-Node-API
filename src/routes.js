const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { createAccessToken, verifyToken } = require('./auth');

const router = express.Router();

const client = new DynamoDBClient({ region: 'eu-north-1' });
const dynamoDB = DynamoDBDocumentClient.from(client);

// Login route
router.post('/token', (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.API_USERNAME || password !== process.env.API_PASSWORD) {
    return res.status(401).json({ detail: 'Incorrect username or password' });
  }
  const accessToken = createAccessToken({ sub: username });
  res.json({ access_token: accessToken, token_type: 'bearer' });
});

// Staff routes
router.post('/staff', verifyToken, async (req, res) => {
  try {
    const command = new PutCommand({
      TableName: 'Staff',
      Item: req.body
    });
    await dynamoDB.send(command);
    res.json({ message: 'Staff created successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/staff', verifyToken, async (req, res) => {
  try {
    const command = new ScanCommand({ TableName: 'Staff' });
    const data = await dynamoDB.send(command);
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/staff/:staffId', verifyToken, async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: 'Staff',
      Key: { staffID: req.params.staffId }
    });
    const data = await dynamoDB.send(command);
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ detail: 'Staff not found' });
    }
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.put('/staff/:staffId', verifyToken, async (req, res) => {
  try {
    const { updates } = req.body;
    const updateExpression = 'set ' + Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => {
      acc[`:${key}`] = updates[key];
      return acc;
    }, {});

    const command = new UpdateCommand({
      TableName: 'Staff',
      Key: { staffID: req.params.staffId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const data = await dynamoDB.send(command);
    res.json(data.Attributes);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.delete('/staff/:staffId', verifyToken, async (req, res) => {
  try {
    const command = new DeleteCommand({
      TableName: 'Staff',
      Key: { staffID: req.params.staffId }
    });
    await dynamoDB.send(command);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Shifts routes
router.post('/shifts', verifyToken, async (req, res) => {
  try {
    const command = new PutCommand({
      TableName: 'Shifts',
      Item: req.body
    });
    await dynamoDB.send(command);
    res.json({ message: 'Shift created successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/shifts', verifyToken, async (req, res) => {
  try {
    const command = new ScanCommand({ TableName: 'Shifts' });
    const data = await dynamoDB.send(command);
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/shifts/:shiftId/:startDate', verifyToken, async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: 'Shifts',
      Key: { 
        shiftID: req.params.shiftId,
        startDate: req.params.startDate
      }
    });
    const data = await dynamoDB.send(command);
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ detail: 'Shift not found' });
    }
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.put('/shifts/:shiftId/:startDate', verifyToken, async (req, res) => {
  try {
    const { updates } = req.body;
    const updateExpression = 'set ' + Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => {
      acc[`:${key}`] = updates[key];
      return acc;
    }, {});

    const command = new UpdateCommand({
      TableName: 'Shifts',
      Key: { 
        shiftID: req.params.shiftId,
        startDate: req.params.startDate
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const data = await dynamoDB.send(command);
    res.json(data.Attributes);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.delete('/shifts/:shiftId/:startDate', verifyToken, async (req, res) => {
  try {
    const command = new DeleteCommand({
      TableName: 'Shifts',
      Key: { 
        shiftID: req.params.shiftId,
        startDate: req.params.startDate
      }
    });
    await dynamoDB.send(command);
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Expenses routes
router.post('/expense', verifyToken, async (req, res) => {
  try {
    const command = new PutCommand({
      TableName: 'Expenses',
      Item: req.body
    });
    await dynamoDB.send(command);
    res.json({ message: 'Expense created successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/expenses', verifyToken, async (req, res) => {
  try {
    const command = new ScanCommand({ TableName: 'Expenses' });
    const data = await dynamoDB.send(command);
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/expense/:expenseId/:date', verifyToken, async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: 'Expenses',
      Key: { 
        expenseID: req.params.expenseId,
        date: req.params.date
      }
    });
    const data = await dynamoDB.send(command);
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ detail: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.put('/expense/:expenseId/:date', verifyToken, async (req, res) => {
  try {
    const { updates } = req.body;
    const updateExpression = 'set ' + Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => {
      acc[`:${key}`] = updates[key];
      return acc;
    }, {});

    const command = new UpdateCommand({
      TableName: 'Expenses',
      Key: { 
        expenseID: req.params.expenseId,
        date: req.params.date
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const data = await dynamoDB.send(command);
    res.json(data.Attributes);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.delete('/expense/:expenseId/:date', verifyToken, async (req, res) => {
  try {
    const command = new DeleteCommand({
      TableName: 'Expenses',
      Key: { 
        expenseID: req.params.expenseId,
        date: req.params.date
      }
    });
    await dynamoDB.send(command);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;