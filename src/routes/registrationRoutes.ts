import { Router } from "express";
import { registerShopOwner } from "../services/landingPageService.js";

export const registrationRoutes = Router();

registrationRoutes.post("/register-shop", (req, res) => {
  try {
    const result = registerShopOwner(req.body);

    res.status(201).json({
      ownerId: result.owner.id,
      shopId: result.shop.id,
      shopSlug: result.shop.slug,
      defaultTemplate: result.landingPage.templateKey,
      redirectTo: `/owner/landing-page/editor/${result.shop.slug}`
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
