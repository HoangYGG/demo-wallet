const { sign } = require("jsonwebtoken");

const walletAddress = "0xbe932a99eaae5bd33139e59dbcb788a22570a7fc";
const addressShort = walletAddress.slice(
  walletAddress.replace("0x", "").length / 2
);

const secret = Buffer.from(addressShort).toString("hex");

const jwt = sign(walletAddress, secret);
console.log("🚀 ~ file: test.js:9 ~ jwt", jwt);
