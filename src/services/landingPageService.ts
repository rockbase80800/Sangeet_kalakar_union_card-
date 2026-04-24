import { nanoid } from "nanoid";
import { z } from "zod";
import { db, seedBookingConfig, seedShopServices } from "../db/store.js";
import { DEFAULT_TEMPLATE_KEY, defaultLandingPageContent } from "../domain/template.js";
import type { LandingPage, LandingPageState, Role, Shop, User } from "../domain/types.js";
import { sanitizePlainText } from "../utils/sanitize.js";

const registerSchema = z.object({
  ownerName: z.string().min(2).max(80),
  shopName: z.string().min(2).max(80),
  address: z.string().min(5).max(160),
  phone: z.string().min(8).max(20)
});

const contentPatchSchema = z.object({
  header: z
    .object({
      shopName: z.string().min(2).max(80).optional(),
      tagline: z.string().min(0).max(120).optional(),
      contactNumber: z.string().min(8).max(20).optional(),
      address: z.string().min(5).max(160).optional(),
      workingHours: z.string().min(3).max(60).optional()
    })
    .optional(),
  about: z
    .object({
      description: z.string().min(10).max(500).optional(),
      yearsExperience: z.number().min(0).max(80).optional(),
      speciality: z.string().min(2).max(120).optional()
    })
    .optional(),
  location: z
    .object({
      address: z.string().min(5).max(160).optional(),
      mapLat: z.number().min(-90).max(90).optional(),
      mapLng: z.number().min(-180).max(180).optional()
    })
    .optional()
});

const mediaSchema = z.object({
  photos: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().url(),
        sizeMb: z.number().max(2),
        position: z.number().int().min(1).max(5)
      })
    )
    .max(5)
    .optional(),
  video: z
    .object({
      id: z.string().optional(),
      url: z.string().url(),
      sizeMb: z.number().max(10)
    })
    .optional()
});

export function registerShopOwner(payload: unknown): { owner: User; shop: Shop; landingPage: LandingPage } {
  const input = registerSchema.parse(payload);
  const ownerId = nanoid();
  const shopId = nanoid();
  const shopSlug = slugify(input.shopName, shopId.slice(0, 6));

  const owner: User = {
    id: ownerId,
    role: "owner",
    phone: input.phone
  };

  const shop: Shop = {
    id: shopId,
    ownerId,
    slug: shopSlug,
    name: sanitizePlainText(input.shopName, 80),
    address: sanitizePlainText(input.address, 160),
    createdAt: new Date().toISOString()
  };

  const landingPage: LandingPage = {
    id: nanoid(),
    shopId,
    ownerId,
    templateKey: DEFAULT_TEMPLATE_KEY,
    state: "draft",
    content: defaultLandingPageContent(shop.name, shop.address),
    updatedAt: new Date().toISOString()
  };

  db.users.set(owner.id, owner);
  db.shops.set(shop.id, shop);
  db.landingPages.set(shop.id, landingPage);
  seedShopServices(shop.id);
  seedBookingConfig(shop.id);

  return { owner, shop, landingPage };
}

export function getOwnerPage(ownerId: string): LandingPage | undefined {
  return Array.from(db.landingPages.values()).find((lp) => lp.ownerId === ownerId);
}

export function patchOwnerContent(ownerId: string, payload: unknown): LandingPage {
  const page = getRequiredOwnerPage(ownerId);
  const input = contentPatchSchema.parse(payload);

  if (input.header) {
    page.content.header = {
      ...page.content.header,
      ...sanitizeObject(input.header)
    };
  }

  if (input.about) {
    page.content.about = {
      ...page.content.about,
      ...sanitizeObject(input.about)
    };
  }

  if (input.location) {
    page.content.location = {
      ...page.content.location,
      ...sanitizeObject(input.location)
    };
  }

  page.updatedAt = new Date().toISOString();
  db.landingPages.set(page.shopId, page);

  return page;
}

export function patchMedia(ownerId: string, payload: unknown): LandingPage {
  const page = getRequiredOwnerPage(ownerId);
  const input = mediaSchema.parse(payload);

  if (input.photos) {
    page.content.media.photos = input.photos.map((item) => ({
      id: item.id ?? nanoid(),
      url: item.url,
      position: item.position
    }));
  }

  if (input.video) {
    page.content.media.video = {
      id: input.video.id ?? nanoid(),
      url: input.video.url
    };
  }

  page.updatedAt = new Date().toISOString();
  db.landingPages.set(page.shopId, page);

  return page;
}

export function patchServiceVisibility(ownerId: string, hiddenServiceIds: string[]): LandingPage {
  const page = getRequiredOwnerPage(ownerId);
  const allowedServiceIds = Array.from(db.services.values())
    .filter((service) => service.shopId === page.shopId)
    .map((service) => service.id);

  page.content.services.hiddenServiceIds = hiddenServiceIds.filter((id) => allowedServiceIds.includes(id));
  page.updatedAt = new Date().toISOString();
  db.landingPages.set(page.shopId, page);

  return page;
}

export function setLandingPageState(shopId: string, state: LandingPageState): LandingPage {
  const page = db.landingPages.get(shopId);
  if (!page) throw new Error("Landing page not found");

  page.state = state;
  page.updatedAt = new Date().toISOString();
  db.landingPages.set(shopId, page);

  return page;
}

export function getPublicShopPage(slug: string, actorRole: Role): Record<string, unknown> {
  const shop = Array.from(db.shops.values()).find((item) => item.slug === slug);
  if (!shop) throw new Error("Shop not found");

  const page = db.landingPages.get(shop.id);
  if (!page) throw new Error("Landing page missing");

  if (page.state === "draft" && actorRole !== "owner" && actorRole !== "admin") {
    throw new Error("Shop page is not live yet");
  }

  if (page.state === "suspended" && actorRole !== "admin") {
    throw new Error("Shop page suspended by admin");
  }

  const services = Array.from(db.services.values())
    .filter((service) => service.shopId === shop.id && service.enabled)
    .filter((service) => !page.content.services.hiddenServiceIds.includes(service.id));

  const booking = db.bookingConfig.get(shop.id);
  const reviews = Array.from(db.reviews.values()).filter((review) => review.shopId === shop.id);
  const ratingAvg =
    reviews.length > 0 ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length : null;

  return {
    shop: {
      id: shop.id,
      slug: shop.slug,
      state: page.state,
      template: page.templateKey
    },
    sections: {
      header: page.content.header,
      about: page.content.about,
      services,
      media: page.content.media,
      ratings: {
        averageRating: ratingAvg,
        totalReviews: reviews.length,
        items: reviews
      },
      booking: {
        ctaText: "Book Appointment",
        slotSyncSource: booking?.slotSyncSource,
        homeServiceEnabled: booking?.homeServiceEnabled
      },
      location: {
        ...page.content.location,
        distanceCalculation: "marketplace-service"
      }
    }
  };
}

function getRequiredOwnerPage(ownerId: string): LandingPage {
  const page = getOwnerPage(ownerId);
  if (!page) throw new Error("Landing page not found for owner");
  return page;
}

function sanitizeObject<T extends Record<string, unknown>>(input: T): T {
  const sanitized = { ...input };

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizePlainText(value, 500) as T[Extract<keyof T, string>];
    }
  });

  return sanitized;
}

function slugify(name: string, suffix: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${suffix}`;
}
