import { Router } from "express";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateJWTToken } from "../services/token.js";
import auth2 from "../middleware/auth2.js";


const router = Router();

router.get("/register",auth2, (req, res) => {
  res.render("register", {
    title: "Register | Sammi",
    isLogin: true,
    registerError: req.flash('registerError'),
  });
});

router.get("/login",auth2, (req, res) => {
  res.render("login", {
    title: "Login | Sammi",
    isRegister: true,
    loginError: req.flash('loginError'),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('loginError', 'All fields should be filled');
    return res.redirect('/login');
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash('loginError', 'User not found!');
    return res.redirect('/login');
  }

  const isPassEqual = await bcrypt.compare(password, existUser.password);
  if (!isPassEqual) {
    req.flash('loginError', 'Password wrong!');
    return res.redirect('/login');
  }

  
  const token = generateJWTToken(existUser._id)
  res.cookie('token',token,{httpOnly:true,secure:true})

  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // User with the same email already exists
      req.flash('registerError', 'User with this email already exists');
      return res.redirect('/register');
    }

    // Manual validation
    const errors = [];
    if (!name || !email || !password) {
      errors.push('All fields should be filled');
    } else {
      if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('Valid email is required');
      }
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
    }

    if (errors.length > 0) {
      req.flash('registerError', errors.join('<br>'));
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const user = await User.create(userData);

    const token = generateJWTToken(user._id)
    res.cookie('token',token,{httpOnly:true,secure:true})
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');  // Clear the token cookie
  res.locals.token = false;  // Set token to false
  res.redirect('/');  // Redirect to the homepage
});


export default router;
