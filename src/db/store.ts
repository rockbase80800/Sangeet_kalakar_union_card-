import { nanoid } from "nanoid";
import type { BookingConfig, LandingPage, Review, ServiceItem, Shop, User } from "../domain/types.js";

export const db = {
  users: new Map<string, User>(),
  shops: new Map<string, Shop>(),
  landingPages: new Map<string, LandingPage>(),
  services: new Map<string, ServiceItem>(),
  reviews: new Map<string, Review>(),
  bookingConfig: new Map<string, BookingConfig>()
};

export function seedShopServices(shopId: string): ServiceItem[] {
  const seed: Array<Omit<ServiceItem, "id">> = [
    { shopId, title: "Haircut", price: 300, durationMin: 30, enabled: true },
    { shopId, title: "Beard Trim", price: 200, durationMin: 20, enabled: true },
    { shopId, title: "Hair + Beard Combo", price: 450, durationMin: 50, enabled: true }
  ];

  return seed.map((item) => {
    const service: ServiceItem = { id: nanoid(), ...item };
    db.services.set(service.id, service);
    return service;
  });
}

export function seedBookingConfig(shopId: string): BookingConfig {
  const cfg: BookingConfig = {
    shopId,
    slotSyncSource: "booking-engine",
    homeServiceEnabled: false
  };

  db.bookingConfig.set(shopId, cfg);
  return cfg;
}
