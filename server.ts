import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Stripe initialization
  console.log("Initializing Stripe with key:", process.env.STRIPE_SECRET_KEY ? "PRESENT" : "MISSING");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia" as any,
  });

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", stripeConfigured: !!process.env.STRIPE_SECRET_KEY });
  });

  // API Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    console.log("Received payment intent request. Body:", JSON.stringify(req.body));
    try {
      const { amount } = req.body;

      if (amount === undefined || amount === null) {
        console.error("Missing amount in request body");
        return res.status(400).json({ error: "Amount is required" });
      }

      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        console.error("Invalid amount:", amount);
        return res.status(400).json({ error: "Invalid amount" });
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        console.error("STRIPE_SECRET_KEY is missing");
        return res.status(500).json({ error: "Stripe secret key not configured on server" });
      }

      console.log("Creating payment intent for:", numericAmount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(numericAmount * 100), // Stripe expects cents
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("Payment intent created successfully:", paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
