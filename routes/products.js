import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from '../middleware/auth.js'
import userMiddleware from "../middleware/user.js";
import moment from "moment";

const router = Router()

router.get("/", async (req, res) => {
  const products = await Product.find().lean();

  products.forEach(product => {
    
  product.formattedCreatedAt = moment(product.createdAt).format('DD MMM YYYY');
  });

  res.render("index", {
    title: "Boom shop | Sammi",
    products: products.reverse(),
    userId: req.userId || null,
  });
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProducts = await Product.find({ user }).populate('user').lean();

  myProducts.forEach(product => {
  product.formattedCreatedAt = moment(product.createdAt).format('DD MMM YYYY');
  });

  res.render("products", {
    title: 'Products | Sammi',
    isProducts: true,
    myProducts: myProducts,
    userId: req.userId // Ensure you have req.userId set somewhere in your middleware
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: 'Add products',
    isAdd: true,
    addError: req.flash('addError'),
  });
});

router.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate('user').lean();
  product.formattedCreatedAt = moment(product.createdAt).format('DD MMM YYYY');

  res.render('product', {
    product: product,
  });
});

router.get('/edit-product/:id',async (req,res)=>{
  const id = req.params.id
  const product = await Product.findById(id).populate('user').lean();

  res.render('edit-product',{
    product:product,
    editError: req.flash('editError')
  })
})

router.post('/edit-product/:id', async (req, res) => {
  const id = req.params.id
  const { title, description, image, price } = req.body;
  if (!id || !title || !description || !image || !price) {
    // Handle case where required fields are missing
    req.flash('editError', 'All fields should be filled');
    return res.redirect(`/edit-product/${id}`);
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price
    }, { new: true });

    if (!updatedProduct) {
      // Handle case where product with given id is not found
      req.flash('editError', 'Product not found');
      return res.redirect(`/edit-product/${id}`);
    }

    res.redirect(`/products`);
  } catch (error) {
    console.error(error);
    req.flash('editError', 'Failed to update product. Please try again.');
    res.redirect(`/edit-product/${id}`);
  }
});



router.post('/add-product', userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash('addError', 'All fields should be filled');
    res.redirect('/add');
  } else {
    try {
      await Product.create({ ...req.body, user: req.userId });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      req.flash('addError', 'Failed to add product. Please try again.');
      res.redirect('/add');
    }
  }
});

router.post('/delete-product/:id',async(req,res)=>{
  const id = req.params.id
  await Product.findByIdAndDelete(id)
  res.redirect('/')
})

export default router;
