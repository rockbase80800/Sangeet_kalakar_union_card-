import express from "express";
import { mockAuth } from "./middleware/auth.js";
import { registrationRoutes } from "./routes/registrationRoutes.js";
import { ownerRoutes } from "./routes/ownerRoutes.js";
import { publicRoutes } from "./routes/publicRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";

export const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(mockAuth);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", registrationRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
