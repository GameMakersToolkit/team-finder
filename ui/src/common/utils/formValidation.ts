export interface PostFormValidationErrors {
  description?: string;
  skills?: string;
  portfolioLinks?: string;
}

export function validateRequiredDescription(description: string): string | undefined {
  if (!description.trim()) {
    return "A description is required";
  }

  return undefined;
}

export function validateSkillsSelection(skillsSought: string[], skillsPossessed: string[]): string | undefined {
  if (skillsSought.length === 0 && skillsPossessed.length === 0) {
    return "Please add some skills you have and/or are looking for";
  }

  return undefined;
}

export function validatePortfolioLink(url: string): string | undefined {
  if (
    url.includes("?") ||
    url.includes("#") ||
    url.includes("&") ||
    url.includes("%") ||
    /\s/.test(url)
  ) {
    return "Portfolio links should not contain a query string. Remove query parameters, fragments, or suspicious characters.";
  }

  return undefined;
}

export function validatePortfolioLinks(urls: string[]): string | undefined {
  for (const url of urls) {
    const error = validatePortfolioLink(url);
    if (error) {
      return error;
    }
  }

  return undefined;
}
