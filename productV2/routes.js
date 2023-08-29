const router = require('express').Router();
const productController = require('./controller');

router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
router.post('/product', productController.addProduct);
router.put('/product/:id', productController.editProductById);
router.delete('/product/:id', productController.deleteProductById);

module.exports = router;
