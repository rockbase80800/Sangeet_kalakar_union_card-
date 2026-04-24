import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { badRequest } from "../utils/http.js";
import {
  getOwnerPage,
  patchMedia,
  patchOwnerContent,
  patchServiceVisibility,
  setLandingPageState
} from "../services/landingPageService.js";

export const ownerRoutes = Router();
ownerRoutes.use(requireRole("owner"));

ownerRoutes.get("/landing-page", (req, res) => {
  const ownerId = req.actor?.userId;
  if (!ownerId) return badRequest(res, "Owner ID missing");

  const page = getOwnerPage(ownerId);
  if (!page) return badRequest(res, "Landing page not found");

  return res.json(page);
});

ownerRoutes.patch("/landing-page/content", (req, res) => {
  try {
    const ownerId = req.actor?.userId;
    if (!ownerId) return badRequest(res, "Owner ID missing");

    const page = patchOwnerContent(ownerId, req.body);
    return res.json(page);
  } catch (error) {
    return badRequest(res, (error as Error).message);
  }
});

ownerRoutes.patch("/landing-page/media", (req, res) => {
  try {
    const ownerId = req.actor?.userId;
    if (!ownerId) return badRequest(res, "Owner ID missing");

    const page = patchMedia(ownerId, req.body);
    return res.json(page);
  } catch (error) {
    return badRequest(res, (error as Error).message);
  }
});

ownerRoutes.patch("/landing-page/services", (req, res) => {
  try {
    const ownerId = req.actor?.userId;
    if (!ownerId) return badRequest(res, "Owner ID missing");

    const hiddenServiceIds = Array.isArray(req.body?.hiddenServiceIds) ? req.body.hiddenServiceIds : [];
    const page = patchServiceVisibility(ownerId, hiddenServiceIds);
    return res.json(page);
  } catch (error) {
    return badRequest(res, (error as Error).message);
  }
});

ownerRoutes.patch("/landing-page/state", (req, res) => {
  try {
    const ownerId = req.actor?.userId;
    if (!ownerId) return badRequest(res, "Owner ID missing");

    const page = getOwnerPage(ownerId);
    if (!page) return badRequest(res, "Landing page not found");

    const desiredState = req.body?.state;
    if (desiredState !== "draft" && desiredState !== "live") {
      return badRequest(res, "Owner can only switch between draft and live");
    }

    return res.json(setLandingPageState(page.shopId, desiredState));
  } catch (error) {
    return badRequest(res, (error as Error).message);
  }
});
