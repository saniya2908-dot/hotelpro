const test = require("node:test");
const assert = require("node:assert/strict");
const { parseDateOnly } = require("../controllers/bookingController");

test("accepts real calendar dates in YYYY-MM-DD format", () => {
  assert.equal(parseDateOnly("2028-02-29").toISOString(), "2028-02-29T00:00:00.000Z");
});

test("rejects invalid, non-canonical, and timestamp dates", () => {
  for (const value of ["2027-02-29", "2028-2-09", "2028-02-29T00:00:00Z", "", null, 123]) {
    assert.equal(parseDateOnly(value), null, `expected ${String(value)} to be rejected`);
  }
});
