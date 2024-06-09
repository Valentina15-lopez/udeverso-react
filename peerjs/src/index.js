import { PeerServer } from "peer";
import fs from "fs";

const peerServer = PeerServer({
  port: 9000,
  path: "/",
  debug: 2, // Cambia este valor según el nivel de logs que desees
  ssl: {
    key: fs.readFileSync("privkey.pem", "utf8"),
    cert: fs.readFileSync("fullchain.pem", "utf8"),
  },
});

console.log("Servidor Peer escuchando en el puerto 9000...");