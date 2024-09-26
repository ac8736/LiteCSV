import { Domain } from "./types";

/**
 * Validate the domain against the following rules:
 * - Domain should start with http:// or https://
 * - Domain should not contain a path (e.g. /path)
 * - Domain should have a valid ending (e.g. .com, .xyz, .app)
 *
 * RegExp expressions were obtained with the assistance of chatGPT
 *
 * @param domain Domain string to validate
 * @returns An array of error messages. If the array is empty, the domain is valid.
 */
export function validateDomain(domain: string): string {
  if (domain === "") {
    return "Domain cannot be empty";
  }

  const noHTTP: RegExp = /^(?!https?:\/\/)/;
  if (!noHTTP.test(domain)) {
    return "Domain should start with http:// or https://";
  }

  const noPath: RegExp = /^[^\/\?]+$/;
  if (!noPath.test(domain)) {
    return "Domain should not contain a path (e.g. /path)";
  }

  const validTLD = /\.(com|xyz|app)$/i;
  if (!validTLD.test(domain)) {
    return "Domain must end with .com, .xyz, or .app.";
  }

  const validDomainStructure = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/;
  if (!validDomainStructure.test(domain)) {
    return "Invalid domain format.";
  }

  return "";
}

/**
 * Takes a list of domains and sorts them based on the following criteria:
 * - Domains ending with .com should come first
 * - Domains ending with .app should come second
 * - Domains ending with .xyz should come last
 * - If two domains have the same ending, the shorter domain should come first
 *
 * Sorting keys were obtained with the assistance of chatGPT
 *
 * @param domains List of domains to be sorted
 * @returns Returns the sorted list of domains
 */
export function sortDomains(domains: Domain[]): Domain[] {
  return domains.sort((a, b) => {
    const domainOrder: string[] = [".com", ".app", ".xyz"];

    const aEnding = domainOrder.find((ending) => a.domain.endsWith(ending));
    const bEnding = domainOrder.find((ending) => b.domain.endsWith(ending));

    if (aEnding !== bEnding) {
      return domainOrder.indexOf(aEnding!) - domainOrder.indexOf(bEnding!);
    }

    return a.domain.length - b.domain.length;
  });
}

/**
 * Check if a domain is already in the cart.
 *
 * @param domain the domain to check
 * @param cart the cart containing the list of domains
 * @returns true if domain is already in the cart, false otherwise
 */
export function checkForDuplicateDomain(domain: string, cart: Domain[]): boolean {
  return cart.some((item) => item.domain === domain);
}
