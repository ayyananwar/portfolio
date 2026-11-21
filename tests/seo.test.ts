import { test } from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";

for (const environment of ["production", "preview", "development"]) {
  test(`crawler policy for ${environment}`, () => {
    const previous = process.env.VERCEL_ENV;
    try {
      process.env.VERCEL_ENV = environment;
      if (environment === "production") {
        assert.deepEqual(
          sitemap().map((entry) => entry.url),
          ["https://www.ayyan.tech/"],
        );
        assert.equal(robots().sitemap, "https://www.ayyan.tech/sitemap.xml");
      } else {
        assert.deepEqual(sitemap(), []);
        assert.deepEqual(robots().rules, { userAgent: "*", disallow: "/" });
      }
    } finally {
      if (previous === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previous;
    }
  });
}
