import { describe, expect, it } from "vitest";
import {
  validatePortfolioLinks,
  validateRequiredDescription,
  validateSkillsSelection,
} from "../../src/common/utils/formValidation";

describe("formValidation", () => {
  it("requires non-empty description", () => {
    expect(validateRequiredDescription("   ")).toBe("A description is required");
    expect(validateRequiredDescription("hello")).toBeUndefined();
  });

  it("requires at least one skill", () => {
    expect(validateSkillsSelection([], [])).toBe("Please add some skills you have and/or are looking for");
    expect(validateSkillsSelection(["programming"], [])).toBeUndefined();
  });

  it("rejects suspicious portfolio links", () => {
    expect(validatePortfolioLinks(["https://example.com?a=1"])).toContain("query string");
    expect(validatePortfolioLinks(["https://example.com/path"])).toBeUndefined();
  });
});
