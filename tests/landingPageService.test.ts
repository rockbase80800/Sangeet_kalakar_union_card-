import test from "node:test";
import assert from "node:assert/strict";
import { registerShopOwner, patchOwnerContent, getPublicShopPage, setLandingPageState } from "../src/services/landingPageService.js";

test("registration creates default template landing page in draft", () => {
  const { owner, shop, landingPage } = registerShopOwner({
    ownerName: "Rahul",
    shopName: "Rahul Clippers",
    address: "MG Road, Bengaluru",
    phone: "+91-9000000000"
  });

  assert.equal(owner.role, "owner");
  assert.equal(landingPage.state, "draft");
  assert.ok(shop.slug.includes("rahul-clippers"));
});

test("owner content update sanitizes tags", () => {
  const { owner } = registerShopOwner({
    ownerName: "Irfan",
    shopName: "Irfan Barbers",
    address: "Link Road, Mumbai",
    phone: "+91-9888888888"
  });

  const page = patchOwnerContent(owner.id, {
    about: {
      description: "<b>Trusted</b> by families for sharp grooming services"
    }
  });

  assert.equal(page.content.about.description.includes("<b>"), false);
});

test("public route blocks draft page for customers", () => {
  const { shop } = registerShopOwner({
    ownerName: "Vijay",
    shopName: "Vijay Salon",
    address: "Main Street, Pune",
    phone: "+91-9777777777"
  });

  assert.throws(() => getPublicShopPage(shop.slug, "customer"));
});

test("admin/live state allows customer visibility", () => {
  const { shop } = registerShopOwner({
    ownerName: "Arjun",
    shopName: "Arjun Groom Lab",
    address: "City Center, Delhi",
    phone: "+91-9666666666"
  });

  setLandingPageState(shop.id, "live");
  const view = getPublicShopPage(shop.slug, "customer");
  assert.equal((view.shop as { state: string }).state, "live");
});
