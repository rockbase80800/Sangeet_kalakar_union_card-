import { Router } from "express";
import { getPublicShopPage } from "../services/landingPageService.js";
import type { Role } from "../domain/types.js";

export const publicRoutes = Router();

publicRoutes.get("/shops/:slug", (req, res) => {
  try {
    const role = (req.actor?.role || "customer") as Role;
    const data = getPublicShopPage(req.params.slug, role);
    return res.json(data);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});
