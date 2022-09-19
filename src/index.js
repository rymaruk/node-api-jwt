import express from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import generateAccessToken from "./utils/generateAccessToken";
import authenticateUser from "./utils/authenticateUser";
import clusterRun from "./cluster";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const store = {
  refreshTokens: [],
};

function apiLogin(req, res) {
  const username = req.body.username;
  const user = { user: username };

  const token = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  store.refreshTokens.push(refreshToken);

  res.json({ token, refreshToken });
}

function apiToken(req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  if (!store.refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403);

    const token = generateAccessToken(data.user);
    res.json({ token });
  });
}

function apiUser(req, res) {
  res.json({
    user: req.user,
  });
}

app.post("/api/login", apiLogin);
app.post("/api/token", apiToken);
app.get("/api/user", authenticateUser, apiUser);

// app.listen(5000, () => console.log("Server started. http://localhost:5000"));
clusterRun(app);
