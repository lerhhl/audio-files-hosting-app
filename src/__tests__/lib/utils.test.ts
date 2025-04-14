import { decrypt, encrypt, hashPassword } from "@/lib/utils";

Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: async (algorithm: string, data: ArrayBuffer) => {
        const buffer = new Uint8Array(data);
        const hash = buffer.reduce(
          (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
          ""
        );
        return new TextEncoder().encode(hash).buffer; // Mocked hash
      },
    },
  },
});

describe("hashPassword", () => {
  it("should hash the password correctly", async () => {
    const password = "testPassword";
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).toBe(
      "fd5cb51bafd60f6fdbedde6e62c473da6f247db271633e15919bab78a02ee9eb"
    );
  });

  it("should return different hashes for different passwords", async () => {
    const password1 = "password1";
    const password2 = "password2";
    const hashedPassword1 = await hashPassword(password1);
    const hashedPassword2 = await hashPassword(password2);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });
});

describe("encrypt", () => {
  it("should throw an error if the key is invalid", async () => {
    const invalidKey = new TextEncoder().encode("invalidKey");
    const expirationTimeInDays = 1;
    const payload = {
      userId: 1,
      username: "testUser",
      isAdmin: false,
      iat: 1234567890,
      exp: 1234567890,
    };

    await expect(
      encrypt(invalidKey, expirationTimeInDays, payload)
    ).rejects.toThrow();
  });
});

describe("decrypt", () => {
  it("should return invalid session if session is empty", async () => {
    const encodedKey = new TextEncoder().encode("validKey");
    const session = "";

    const result = await decrypt(encodedKey, session);
    expect(result).toEqual({
      username: undefined,
      isAuth: false,
      isAdmin: false,
    });
  });

  it("should return invalid session if payload is missing username", async () => {
    const encodedKey = new TextEncoder().encode("validKey");
    const session = "invalidSession";

    const result = await decrypt(encodedKey, session);
    expect(result).toEqual({
      username: undefined,
      isAuth: false,
      isAdmin: false,
    });
  });
});
