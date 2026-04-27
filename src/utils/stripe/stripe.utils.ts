import { loadStripe } from "@stripe/stripe-js";
import { getRequiredEnv } from "../secret.utils";

export const stripePromise = loadStripe(
  getRequiredEnv(
    "REACT_APP_STRIPE_PUBLISHABLE_KEY",
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  ),
);
