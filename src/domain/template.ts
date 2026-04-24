import type { LandingPageContent } from "./types.js";

export const DEFAULT_TEMPLATE_KEY = "classic-barber-v1";

export function defaultLandingPageContent(shopName: string, address: string): LandingPageContent {
  return {
    header: {
      shopName,
      tagline: "Precision cuts, modern style, trusted service.",
      contactNumber: "",
      address,
      workingHours: "Mon-Sat 10:00 AM - 8:00 PM"
    },
    about: {
      description: "Tell customers what makes your barber shop special.",
      yearsExperience: 1,
      speciality: "Fade, Beard styling, Grooming"
    },
    services: {
      hiddenServiceIds: []
    },
    media: {
      photos: [],
      video: undefined
    },
    location: {
      mapLat: 0,
      mapLng: 0,
      address
    }
  };
}
