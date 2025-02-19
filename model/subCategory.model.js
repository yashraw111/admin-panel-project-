const { Schema, model } = require("mongoose");

const subCateModel = Schema({
  cat_name: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  sub_category: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const SubCategory = model("subCategory", subCateModel);

module.exports = SubCategory;
