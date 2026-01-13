import Stripe from "stripe";
import { stripe_secret_key } from "../../../config/config";

const stripe = new Stripe(stripe_secret_key as string, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

export default stripe;