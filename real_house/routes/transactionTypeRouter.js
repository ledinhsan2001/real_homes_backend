const express = require('express');
const { getDetailTrans, getAllTrans, addTransactionType, putTransactionType, deleteTransactionType } = require('../controllers/transTypeController');
const { isAdmin } = require('../middlewares/authJWT');

const transactionTypeRouter = express.Router();

transactionTypeRouter.get('/', getAllTrans);
transactionTypeRouter.get('/detail', getDetailTrans);
transactionTypeRouter.post('/add', addTransactionType);
transactionTypeRouter.put('/put', putTransactionType);
transactionTypeRouter.delete('/delete', deleteTransactionType);

module.exports = transactionTypeRouter;