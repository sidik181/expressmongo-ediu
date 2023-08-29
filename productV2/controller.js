const Product = require('./model');

const getProducts = async (req, res) => {
    const getProductsCallback = async () => Product.find();
    await tryCatch(res, getProductsCallback);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const getProductCallback = async () => Product.findById(id);
    await tryCatch(res, getProductCallback);
};

const addProduct = async (req, res) => {
    const { userId, name, price, stock, status } = req.body;
    const image = req.file || null;

    const addProductCallback = async () => {
        if (image) {
            image_url = `http://localhost:3000/public/images/${image.originalname}`;
        }
        const product = await Product.create({ userId, name, price, stock, status, image_url });
        return product;
    };

    await tryCatch(res, addProductCallback);
};

const editProductById = async (req, res) => {
    const { id } = req.params;
    const { userId, name, price, stock, status } = req.body;
    const image = req.file || null;

    const editProductCallback = async () => {
        const product = await Product.findById(id);
        const oldImageUrl = product.image_url;
        let image_url = null;

        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }

        if (image) {
            image_url = `http://localhost:3000/public/images/${image.originalname}`;
        }

        const updateObject = {
            userId: userId,
            name: name,
            price: price,
            stock: stock,
            status: status,
            image_url: image_url
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateObject, { new: true });
        return updatedProduct;
    }

    await tryCatch(res, editProductCallback);
};

const deleteProductById = async (req, res) => {
    const { id } = req.params;

    const deleteProductCallback = async () => {
        const product = await Product.findById(id);

        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        await Product.findByIdAndDelete(id)
        }

    await tryCatch(res, deleteProductCallback);
};

const tryCatch = async (res, functionCallback) => {
    try {
        const result = await functionCallback();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    editProductById,
    deleteProductById
}