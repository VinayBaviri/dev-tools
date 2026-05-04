/**
 * Base64 utility functions for encoding, decoding, file encoding, and size calculation.
 */

/**
 * Encodes a plain text string to Base64.
 * Handles Unicode by encoding to UTF-8 first via TextEncoder.
 *
 * @param input - The plain text string to encode.
 * @returns The Base64-encoded representation of the input.
 */
export function base64Encode(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64-encoded string back to plain text.
 * Handles Unicode by decoding from UTF-8 via TextDecoder.
 * Throws a descriptive error if the input is not valid Base64.
 *
 * @param input - The Base64-encoded string to decode.
 * @returns The decoded plain text string.
 */
export function base64Decode(input: string): string {
  let binary: string;
  try {
    binary = atob(input);
  } catch {
    throw new Error(
      'Invalid Base64 string: the input is not valid Base64. Ensure the string contains only valid Base64 characters (A-Z, a-z, 0-9, +, /) and is properly padded with "=" if needed.',
    );
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Encodes an ArrayBuffer (e.g., file contents) to a Base64 string.
 *
 * @param file - The ArrayBuffer containing the file data to encode.
 * @returns The Base64-encoded representation of the file contents.
 */
export function base64EncodeFile(file: ArrayBuffer): string {
  const bytes = new Uint8Array(file);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Calculates the byte size of a Base64-encoded string.
 * This returns the number of bytes the Base64 string itself occupies,
 * not the size of the decoded content.
 *
 * @param base64String - The Base64-encoded string to measure.
 * @returns The byte count of the encoded string.
 */
export function getEncodedSize(base64String: string): number {
  const encoder = new TextEncoder();
  return encoder.encode(base64String).byteLength;
}
