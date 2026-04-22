import { loadStripe } from "@stripe/stripe-js";
import { getRequiredEnv } from "../secret.utils";

export const stripePromise = loadStripe(
  getRequiredEnv(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY),
);
