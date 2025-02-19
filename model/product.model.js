const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subCategory",
  },
  pr_name: {
    type: String,
    required: true,
    trim: true,
  },
  pr_price: {
    type: Number,
    required: true,
  },

  pr_image: {
    type: String,
  },
});

const Product = model("Product", productSchema);

module.exports = Product;
