const { ObjectId } = require('mongodb');
const db = require('../config/mongodb');
const fs = require('fs');
const path = require('path');
const dbCollection = ('products');

const getProducts = async (req, res) => {
    try {
        const collection = db.collection(dbCollection);
        const data = await collection.find().toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getProductById = (req, res) => {
    const { id } = req.params;
    const collection = db.collection(dbCollection);
    const objectId = new ObjectId(id);

    collection.findOne({ _id: objectId })
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'Produk tidak ditemukan.' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

const addProduct = async (req, res) => {
    const { name, price, stock, status } = req.body;
    const image = req.file;

    try {
        if (image) {
            // const target = path.join(__dirname, '../public/images/', image.originalname);
            // fs.renameSync(image.path, target);
            const collection = db.collection(dbCollection);
            const data = await collection.insertOne({ name, price, stock, status, image_url: `http://localhost:3000/public/images/${image.originalname}` });
            res.status(200).json(data);
        } else {
            const collection = db.collection(dbCollection);
            const data = await collection.insertOne({ name, price, stock, status, image_url: null });
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const editProductById = (req, res) => {
    const { id } = req.params;
    const { name, price, stock, status } = req.body;
    const image = req.file;
    const collection = db.collection('products');
    const objectId = new ObjectId(id);

    collection.findOne({ _id: objectId })
        .then(existingProduct => {
            if (!existingProduct) {
                res.status(404).json({ error: 'Produk tidak ditemukan.' });
                return;
            }

            const updateFields = { name, price, stock, status };

            if (image) {
                // if (existingProduct.image_url) {
                //     const oldImagePath = path.join(__dirname, '../public/images', path.basename(existingProduct.image_url));
                //     fs.unlinkSync(oldImagePath);
                // }

                // const target = path.join(__dirname, '../public/images', image.originalname);
                // fs.renameSync(image.path, target);

                updateFields.image_url = `http://localhost:3000/public/images/${image.originalname}`
            } else {
                updateFields.image_url = null;
                // const oldImagePath = path.join(__dirname, '../public/images', path.basename(existingProduct.image_url));
                // fs.unlinkSync(oldImagePath);
            }

            collection.findOneAndUpdate(
                { _id: objectId },
                { $set: updateFields },
                { returnOriginal: false }
            )
                .then(updatedProduct => {
                    res.status(200).json(updatedProduct.value);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate data.' });
                });
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

const deleteProductById = (req, res) => {
    const { id } = req.params;
    const collection = db.collection('products');
    const objectId = new ObjectId(id);

    collection.findOneAndDelete({ _id: objectId })
        .then(deletedProduct => {
            if (deletedProduct.value) {
                // if (deletedProduct.value.image_url) {
                //     const oldImagePath = path.join(__dirname, '../public/images', path.basename(deletedProduct.value.image_url));
                //     fs.unlinkSync(oldImagePath);
                // }
                res.status(200).json({ message: 'Produk berhasil dihapus' });
            } else {
                res.status(404).json({ error: 'Produk tidak ditemukan.' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    editProductById,
    deleteProductById,
}