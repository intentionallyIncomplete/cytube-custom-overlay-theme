import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitiseAddMediaTitle } from "../../src/lib/sanitise-add-media-title.js";

describe("sanitiseAddMediaTitle", () => {
  it("test_keeps_a_typed_year_outside_parentheses", () => {
    assert.equal(sanitiseAddMediaTitle("Example 1999"), "Example 1999");
    assert.equal(sanitiseAddMediaTitle("Example 1999", { trimEdges: true }), "Example 1999");
  });

  it("test_keeps_a_year_the_user_already_wrapped", () => {
    assert.equal(sanitiseAddMediaTitle("Example (1999)"), "Example (1999)");
  });

  it("test_keeps_years_that_are_not_release_years", () => {
    assert.equal(sanitiseAddMediaTitle("2001: A Space Odyssey"), "2001: A Space Odyssey");
    assert.equal(sanitiseAddMediaTitle("Room 101"), "Room 101");
  });

  it("test_still_splits_filename_dots_and_drops_release_tags", () => {
    assert.equal(
      sanitiseAddMediaTitle("Movie.Name.1999.720p.x264.YIFY.mp4", { trimEdges: true }),
      "Movie Name 1999"
    );
  });

  it("test_preserves_trailing_space_while_typing", () => {
    assert.equal(sanitiseAddMediaTitle("Example 1999 "), "Example 1999 ");
  });
});
