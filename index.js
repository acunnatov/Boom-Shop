// app.js
import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import * as dotenv from 'dotenv'
import flash from 'connect-flash';
// Routes
import AuthRoutes from './routes/auth.js'
import ProductsRoutes from './routes/products.js'
import session from "express-session";
import varMiddleware from './middleware/var.js'
import cookieParser from "cookie-parser";
import userMiddleware from "./middleware/user.js";
import ifequal from './utils/index.js'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: { ifequal: ifequal }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.json())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
app.use(cookieParser())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use(AuthRoutes)
app.use(ProductsRoutes)


const dbURI = process.env.MONGO_URI
const port = process.env.PORT || 3000;
async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Connection error', err);
  }
}

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
