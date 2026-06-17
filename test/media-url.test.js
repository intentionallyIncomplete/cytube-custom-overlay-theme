import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  encodeMediaUrlForQueue,
  encodeMediaUrlsInField
} from "../lib/media-url.js";

describe("media-url", () => {
  it("test_encodeMediaUrlForQueue_encodes_path_spaces", () => {
    const raw = "https://example.com/movies/My Movie.mp4";
    assert.equal(
      encodeMediaUrlForQueue(raw),
      "https://example.com/movies/My%20Movie.mp4"
    );
  });

  it("test_encodeMediaUrlForQueue_preserves_existing_percent20", () => {
    const raw = "https://example.com/movies/My%20Movie.mp4";
    assert.equal(encodeMediaUrlForQueue(raw), raw);
  });

  it("test_encodeMediaUrlForQueue_noop_without_spaces", () => {
    const raw = "https://example.com/movies/MyMovie.mp4";
    assert.equal(encodeMediaUrlForQueue(raw), raw);
  });

  it("test_encodeMediaUrlsInField_single_url", () => {
    assert.equal(
      encodeMediaUrlsInField("https://example.com/a b.mp4"),
      "https://example.com/a%20b.mp4"
    );
  });
});
