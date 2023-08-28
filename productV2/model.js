const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Field nama harus diisi'],
        minlength: 3,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: [true, 'Field harga harus diisi'],
        minlength: 100,
        maxlength: 1000000000000,
    },
    stock: Number,
    status: {
        type: Boolean,
        default: true,
    },
    image_url: {
        type: String,
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
