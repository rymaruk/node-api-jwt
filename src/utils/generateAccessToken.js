import jwt from "jsonwebtoken";

export default function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "120s",
  });
}
