import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import authenticateUser from "./utils/authenticateUser";
import clusterRun from "./cluster";
import {apiLogin, apiLogout, apiToken, apiUser} from "./api";

dotenv.config();

/** @type Express **/
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/api/login", apiLogin);
app.post("/api/logout", authenticateUser, apiLogout);
app.post("/api/token", authenticateUser, apiToken);
app.get("/api/user", authenticateUser, apiUser);

clusterRun(app).then(console.log);
