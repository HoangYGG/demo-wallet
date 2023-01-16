import * as jose from "jose";
import { Buffer } from "buffer";

const toHex = (number) => `0x${Number(number).toString(16)}`;

const createSignature = async () => {
  const walletAddress = "0xbe932a99eaae5bd33139e59dbcb788a22570a7fc";
  const addressShort = walletAddress.slice(
    walletAddress.replace("0x", "").length / 2
  );

  const secret = new TextEncoder().encode(
    Buffer.from(addressShort).toString("hex")
  );
  console.log("🚀 ~ file: utils.js:15 ~ createSignature ~ secret", secret);

  const jwt = await new jose.SignJWT({ "urn:example:claim": true })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return jwt;
};

const utils = {
  toHex,
  createSignature,
};

export default utils;
