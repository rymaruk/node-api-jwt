import jwt from "jsonwebtoken";

export default function generateAccessToken(payload) {
  return jwt.sign({...payload, exec: Date.now()}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "180s",
  });
}
