const router = require('express').Router();
const multer = require('multer');
// const upload = multer({ dest: '../public/images' });
const upload = multer();
const productController = require('./controller');

router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
// router.post('/product', productController.addProduct);
router.post('/product', upload.single('image'), productController.addProduct);
router.put('/product/:id', upload.single('image'), productController.editProductById);
// router.put('/product/:id', productController.editProductById);
router.delete('/product/:id', productController.deleteProductById);

module.exports = router;
