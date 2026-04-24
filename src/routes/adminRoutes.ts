import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { badRequest } from "../utils/http.js";
import { setLandingPageState } from "../services/landingPageService.js";

export const adminRoutes = Router();
adminRoutes.use(requireRole("admin"));

adminRoutes.patch("/landing-pages/:shopId/state", (req, res) => {
  const desiredState = req.body?.state;
  if (desiredState !== "suspended" && desiredState !== "live") {
    return badRequest(res, "Admin can set only suspended or live");
  }

  try {
    const page = setLandingPageState(req.params.shopId, desiredState);
    return res.json(page);
  } catch (error) {
    return badRequest(res, (error as Error).message);
  }
});
