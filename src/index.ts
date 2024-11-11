import express, { Express } from "express";
import bodyParser from 'body-parser';
import { chat,load, save } from "./routes";


// Configure and start the HTTP server.
const port: number = 8080;
const app: Express = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.get("/chat", chat);
// TODO(5d): add routes for /load (GET) and /save (POST)
app.get("/load", load); // Add route for /load
app.post("/save", save); // Add route for /save
app.listen(port, () => console.log(`Server listening on ${port}`));
