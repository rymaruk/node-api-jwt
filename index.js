import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "Brad Peat",
    email: "brad@gmail.com",
  };

  jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

app.post("/api/data", verifyAccess, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Access!",
        authData,
      });
    }
  });
});

function verifyAccess(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started!"));
