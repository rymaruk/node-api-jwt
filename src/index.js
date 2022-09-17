import express from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const store = {
  refreshTokens: [],
};

app.post("/api/login", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const user = { user: username };

  const token = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  store.refreshTokens.push(refreshToken);

  res.json({ token, refreshToken });
});

app.post("/api/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  if (!store.refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403);

    const token = generateAccessToken(data.user);
    res.json({ token });
  });
});

app.get("/api/user", authenticateUser, (req, res) => {
  res.json({
    user: req.user,
  });
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

app.listen(5000, () => console.log("Server started. http://localhost:5000"));
