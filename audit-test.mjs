import assert from "node:assert/strict";
import fs from "node:fs";

function readAssignment(name) {
  const text = fs.readFileSync(new URL(name, import.meta.url), "utf8");
  return JSON.parse(text.slice(text.indexOf("=") + 1).trim().replace(/;$/, ""));
}

const houses = readAssignment("./houses.js").houses;
const flags = readAssignment("./audit-flags.js");
const csv = fs.readFileSync(new URL("./address-audit.csv", import.meta.url), "utf8").trim().split(/\r?\n/).slice(1);

function houseId(house) {
  return house.n + "|" + house.lat.toFixed(5) + "|" + house.lon.toFixed(5);
}

const ids = houses.map(houseId);
assert.equal(new Set(ids).size, ids.length, "every property id is unique");

for (const house of houses) {
  assert.ok(house.n !== "" && house.n != null, "house number present");
  assert.ok(house.street, "street present");
  assert.ok(Number.isFinite(house.lat) && Math.abs(house.lat) <= 90, "latitude");
  assert.ok(Number.isFinite(house.lon) && Math.abs(house.lon) <= 180, "longitude");
}

function copies(street, number) {
  return houses.filter((house) => house.street === street && String(house.n) === String(number));
}

assert.equal(copies("Delford Drive", "9").length, 2);
const nine = copies("Delford Drive", "9").map((house) => [house.lat, house.lon]);
assert.deepEqual(nine.sort((a, b) => a[0] - b[0]), [
  [51.8768365, -8.4184448],
  [51.8787635, -8.4192041]
]);
assert.equal(copies("Kiltegan Lawn", "2").length, 3);

for (const street of ["Delford Drive"]) {
  for (const number of ["9", "22", "32", "33", "34", "39", "42", "44"]) {
    assert.ok(copies(street, number).length >= 2, street + " " + number);
  }
}

const suffixId = houseId({ n: "9A", lat: 51.8, lon: -8.4, street: "Example" });
assert.equal(suffixId.startsWith("9A|"), true);

for (const flag of flags) {
  assert.ok(ids.includes(flag.id), "flag points at a live house: " + flag.id);
  assert.ok(flag.severity === "Critical" || flag.severity === "High");
}

const csvText = csv.join("\n");
assert.ok(csvText.includes("51.8768365"));
assert.ok(csvText.includes("Kiltegan Lawn"));
assert.equal(csv.some((line) => line.includes("Needs Review") || line.includes("Unverified")), true);
assert.equal(csv.some((line) => line.includes(",Verified,")), false);

const page = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
assert.equal(page.includes("called.add(id)"), true, "manual completion remains");
assert.equal(page.includes("function markPassed"), false, "GPS no longer completes a delivery");
assert.equal(page.includes("Not delivered"), true);

console.log("audit checks passed");
