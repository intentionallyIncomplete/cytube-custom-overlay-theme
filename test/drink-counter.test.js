import test from "node:test";
import assert from "node:assert/strict";

const INTOX_THRESHOLDS = [5, 15, 20, 30, 50];

function drinkAnimationCount(prev, next, max = 5) {
  if (prev === null || next <= prev) return 0;
  return Math.min(next - prev, max);
}

function intoxTierForCount(count) {
  const n = Math.max(0, Number(count) || 0);
  let tier = 0;
  for (const threshold of INTOX_THRESHOLDS) {
    if (n >= threshold) tier += 1;
  }
  return tier;
}

test("drink animation count on increment", () => {
  assert.equal(drinkAnimationCount(null, 1), 0);
  assert.equal(drinkAnimationCount(0, 1), 1);
  assert.equal(drinkAnimationCount(3, 4), 1);
  assert.equal(drinkAnimationCount(2, 7), 5);
});

test("drink animation count ignores decrease or flat", () => {
  assert.equal(drinkAnimationCount(5, 5), 0);
  assert.equal(drinkAnimationCount(5, 0), 0);
});

function shouldDrool(count, threshold = 10) {
  return Math.max(0, Number(count) || 0) >= threshold;
}

test("intox tier thresholds", () => {
  assert.equal(intoxTierForCount(0), 0);
  assert.equal(intoxTierForCount(4), 0);
  assert.equal(intoxTierForCount(5), 1);
  assert.equal(intoxTierForCount(14), 1);
  assert.equal(intoxTierForCount(15), 2);
  assert.equal(intoxTierForCount(19), 2);
  assert.equal(intoxTierForCount(20), 3);
  assert.equal(intoxTierForCount(29), 3);
  assert.equal(intoxTierForCount(30), 4);
  assert.equal(intoxTierForCount(49), 4);
  assert.equal(intoxTierForCount(50), 5);
  assert.equal(intoxTierForCount(120), 5);
});

test("drool at ten drinks", () => {
  assert.equal(shouldDrool(9), false);
  assert.equal(shouldDrool(10), true);
  assert.equal(shouldDrool(25), true);
});
