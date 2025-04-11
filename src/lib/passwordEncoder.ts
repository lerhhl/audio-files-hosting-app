export async function passwordEncoder(password: string) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
  const hashedPassword = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashedPassword;
}
