const fs = require('fs');
const path = require('path');
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
    const image = req.file;

    const addProductCallback = async () => {
        let image_url = null;

        if (image) {
            const originaFileName = image.originalname;
            const uploadPath = path.join(__dirname, '../public/images/', originaFileName);
            fs.renameSync(image.path, uploadPath);
            image_url = `http://localhost:3000/public/images/${originaFileName}`;
        }

        const product = await Product.create({ userId, name, price, stock, status, image_url });
        return product;
    };

    await tryCatch(res, addProductCallback);
};

const editProductById = async (req, res) => {
    const { id } = req.params;
    const { userId, name, price, stock, status } = req.body;
    const image = req.file;

    const editProductCallback = async () => {
        const product = await Product.findById(id);
        const oldImageUrl = product.image_url;
        let image_url = null;

        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }

        if (image) {
            if (oldImageUrl) {
                const oldImagePath = path.join(__dirname, '../public/images/', path.basename(oldImageUrl));
                fs.unlink(oldImagePath, (unlinkError) => {
                    if (unlinkError) {
                        console.error('Error delete file gambar sebelumnya:', unlinkError);
                    }
                });
            }
            const originaFileName = image.originalname;
            const uploadPath = path.join(__dirname, '../public/images/', originaFileName);
            fs.renameSync(image.path, uploadPath);
            image_url = `http://localhost:3000/public/images/${originaFileName}`;

        } else if (oldImageUrl) {
            const oldImagePath = path.join(__dirname, '../public/images/', path.basename(oldImageUrl));
            fs.unlink(oldImagePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error delete file gambar sebelumnya:', unlinkError);
                }
            });
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

        if (product.image_url) {
            const imagePath = path.join(__dirname, '../public/images/', path.basename(product.image_url));
            fs.unlink(imagePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error menghapus file gambar:', unlinkError);
                }
                Product.findByIdAndDelete(id)
                    .then(() => {
                        console.log('Produk berhasil dihapus');
                    })
                    .catch((deleteError) => {
                        console.error('Error menghapus produk:', deleteError);
                    });
            });
        } else {
            await Product.findByIdAndDelete(id)
                .then(() => {
                    console.log('Produk berhasil dihapus');
                })
                .catch((deleteError) => {
                    console.error('Error menghapus produk:', deleteError);
                });
        }
    };

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