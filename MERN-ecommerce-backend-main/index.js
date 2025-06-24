require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY);

// --- Models ---
const { User } = require('./model/User');
const { Order } = require('./model/Order');

// --- Routes ---
const productsRouter = require('./routes/Products');
console.log("📦 productsRouter =", productsRouter?.router || productsRouter);
const categoryRouter = require('./routes/Categories');
console.log("📦 categoryRouter =", categoryRouter);
const brandsRouter = require('./routes/Brands');
console.log("📦 brandsRouter =", brandsRouter?.router || brandsRouter);
const usersRouter = require('./routes/Users');
console.log("📦 usersRouter =", usersRouter?.router || usersRouter);
const authRouter = require('./routes/Auth');
console.log("📦 authRouter =", authRouter?.router || authRouter);
const cartRouter = require('./routes/Cart');
console.log("📦 cartRouter =", cartRouter?.router || cartRouter);
const ordersRouter = require('./routes/Order');
console.log("📦 ordersRouter =", ordersRouter?.router || ordersRouter);

// --- Services ---
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

const app = express();
const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET_KEY,
};

// --- Middleware ---
app.use(express.static(path.resolve(__dirname, 'build')));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use(express.json());

// --- Passport Strategies ---
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'invalid credentials' });

      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return done(err);
        if (!crypto.timingSafeEqual(user.password, hashedPassword))
          return done(null, false, { message: 'invalid credentials' });

        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
        return done(null, { id: user.id, role: user.role, token });
      });
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      return user ? done(null, sanitizeUser(user)) : done(null, false);
    } catch (err) {
      done(err, false);
    }
  })
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, role: user.role });
  });
});
passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
});

// --- API Routes ---
app.use('/products', productsRouter.router);
app.use('/categories', categoryRouter); // ✅ this must be module.exports = router
app.use('/brands', brandsRouter); // consistent lowercase
app.use('/users', isAuth(), usersRouter.router);
app.use('/auth', authRouter);
app.use('/cart', isAuth(), cartRouter.router);
app.use('/orders', isAuth(), ordersRouter.router);

// --- Stripe Webhook ---
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if (order) {
      order.paymentStatus = 'received';
      await order.save();
    }
  }

  res.send();
});

// --- Stripe Payment Intent Endpoint ---
app.post('/create-payment-intent', async (req, res) => {
  const { totalAmount, orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

// --- React Fallback Route ---
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// --- Start MongoDB and Server ---
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
  }
}

main();
