/**
 * URL utility functions for encoding, decoding, and parsing URLs.
 */

/**
 * Percent-encodes a plain text string using `encodeURIComponent`.
 *
 * @param input - The plain text string to encode.
 * @returns The percent-encoded representation of the input.
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

/**
 * Decodes a percent-encoded string using `decodeURIComponent`.
 * Throws a descriptive error if the input contains invalid percent-encoding.
 *
 * @param input - The percent-encoded string to decode.
 * @returns The decoded plain text string.
 */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error(
      'Invalid percent-encoded string: the input contains malformed percent-encoding sequences.',
    );
  }
}

/**
 * Represents the parsed components of a URL.
 */
export interface ParsedURL {
  protocol: string;
  host: string;
  port: string;
  path: string;
  queryParams: Record<string, string>;
  fragment: string;
}

/**
 * Parses a URL string into its individual components.
 * Throws a descriptive error if the input is not a valid URL.
 *
 * @param input - The URL string to parse.
 * @returns A `ParsedURL` object containing the parsed components.
 */
export function parseURL(input: string): ParsedURL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error(
      `Invalid URL: "${input}" is not a valid URL. Ensure it includes a protocol (e.g., https://) and a valid host.`,
    );
  }

  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return {
    protocol: url.protocol,
    host: url.hostname,
    port: url.port,
    path: url.pathname,
    queryParams,
    fragment: url.hash ? url.hash.slice(1) : '',
  };
}
