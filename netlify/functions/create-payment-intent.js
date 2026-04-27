require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

// Initialize Firebase Admin once (survives warm lambda invocations)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const { cartItems } = JSON.parse(event.body);
    // cartItems: Array<{ id: number; quantity: number }>

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "cartItems must be a non-empty array." }),
      };
    }

    // Fetch canonical prices from Firestore
    const snapshot = await db.collection("categories").get();
    const priceMap = new Map();
    snapshot.forEach((doc) => {
      const { items } = doc.data();
      if (Array.isArray(items)) {
        items.forEach(({ id, price }) => {
          if (Number.isInteger(id) && Number.isFinite(price) && price >= 0) {
            priceMap.set(id, price);
          }
        });
      }
    });

    // Recompute total server-side
    let total = 0;
    for (const { id, quantity } of cartItems) {
      if (!Number.isInteger(id) || id <= 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Invalid product id: ${id}` }),
        };
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `Invalid quantity for product id: ${id}`,
          }),
        };
      }

      const price = priceMap.get(id);
      if (price === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown product id: ${id}` }),
        };
      }
      total += price * quantity;
    }

    const amount = Math.round(total * 100); // dollars → cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent }),
    };
  } catch (error) {
    console.error("create-payment-intent failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to create payment intent",
      }),
    };
  }
};
