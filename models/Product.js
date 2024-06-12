import { Schema, model } from "mongoose";

// Define the product schema with timestamps
const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true, // Enable timestamps
});

// Create the product model
const Product = model('Product', ProductSchema);

export default Product;
