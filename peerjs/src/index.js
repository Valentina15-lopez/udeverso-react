import { PeerServer } from "peer";

const peerServer = PeerServer({ port: 3002, path: "/" });
console.log("Servidor Peer escuchando en el puerto 3002...");
