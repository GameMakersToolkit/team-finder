import { describe, expect, it, beforeEach } from "vitest";
import {
  safeGetString,
  safeParseJsonArray,
  safeRemoveItem,
  safeSetString,
} from "../../src/common/utils/storageUtils";

describe("storageUtils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves string values", () => {
    expect(safeSetString("k", "v")).toBe(true);
    expect(safeGetString("k")).toBe("v");
  });

  it("removes values safely", () => {
    safeSetString("k", "v");
    expect(safeRemoveItem("k")).toBe(true);
    expect(safeGetString("k")).toBeNull();
  });

  it("parses json arrays safely", () => {
    expect(safeParseJsonArray('["a","b",1]')).toEqual(["a", "b"]);
    expect(safeParseJsonArray("not-json")).toEqual([]);
    expect(safeParseJsonArray(null)).toEqual([]);
  });
});
