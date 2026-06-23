import test from "node:test";
import assert from "node:assert/strict";

function drinkAnimationCount(prev, next, max = 5) {
  if (prev === null || next <= prev) return 0;
  return Math.min(next - prev, max);
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
