const express = require('express');
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/add-product',isAuth,adminController.getAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

router.post('/edit-product',isAuth,adminController.postEditProduct);

router.get('/products',isAuth,adminController.getProducts);

router.post('/product',isAuth,adminController.postAddProduct);

router.post('/delete-product',isAuth,adminController.postDeleteProduct);

module.exports = router;  