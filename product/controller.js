const { ObjectId } = require('mongodb');
const db = require('../config/mongodb');
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
    const image = req.file || null;

    try {
        const collection = db.collection(dbCollection);
        const data = await collection.insertOne({ name, price, stock, status, image_url: `http://localhost:3000/public/images/${image.originalname}` });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const editProductById = (req, res) => {
    const { id } = req.params;
    const { name, price, stock, status } = req.body;
    const image = req.file || null;
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
                updateFields.image_url = `http://localhost:3000/public/images/${image.originalname}`
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