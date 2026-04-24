export type Role = "owner" | "customer" | "admin";

export type LandingPageState = "draft" | "live" | "suspended";

export interface User {
  id: string;
  role: Role;
  phone?: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  shopId: string;
  title: string;
  price: number;
  durationMin: number;
  enabled: boolean;
}

export interface Review {
  id: string;
  shopId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookingConfig {
  shopId: string;
  slotSyncSource: "booking-engine";
  homeServiceEnabled: boolean;
}

export interface LandingPageContent {
  header: {
    shopName: string;
    tagline: string;
    contactNumber: string;
    address: string;
    workingHours: string;
  };
  about: {
    description: string;
    yearsExperience: number;
    speciality: string;
  };
  services: {
    hiddenServiceIds: string[];
  };
  media: {
    photos: Array<{ id: string; url: string; position: number }>;
    video?: { id: string; url: string };
  };
  location: {
    mapLat: number;
    mapLng: number;
    address: string;
  };
}

export interface LandingPage {
  id: string;
  shopId: string;
  ownerId: string;
  templateKey: string;
  state: LandingPageState;
  content: LandingPageContent;
  updatedAt: string;
}
