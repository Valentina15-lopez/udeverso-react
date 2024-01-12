import React, { createContext, useContext, useState } from "react";
import AulaService from "../services/AulaService";
import AulaScene from "../../ presentation/scenes/AulaScene";
import SimplePeer from "simple-peer";
import io from "socket.io-client";
import * as THREE from "three";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [mySocket, setMySocket] = useState(null);
  const aulaService = new AulaService();
  const aulaScene = new AulaScene(); // Crea una instancia de tu servicio

  let peers = {};
  const setupSocketServer = () => {
    // Set up each socket connection
    io.on("connection", (socket) => {
      console.log(
        "Peer joined with ID",
        socket.id,
        ". There are " + io.engine.clientsCount + " peer(s) connected."
      );

      // Add a new client indexed by their socket id
      peers[socket.id] = {
        position: [0, 0.5, 0],
        rotation: [0, 0, 0, 1], // stored as XYZW values of Quaternion
      };

      // Make sure to send the client their ID and a list of ICE servers for WebRTC network traversal
      socket.emit("introduction", Object.keys(peers));

      // also give the client all existing clients positions:
      socket.emit("userPositions", peers);

      // Update everyone that the number of users has changed
      io.emit("newUserConnected", socket.id);

      // whenever the client moves, update their movements in the clients object
      socket.on("move", (data) => {
        if (peers[socket.id]) {
          peers[socket.id].position = data[0];
          peers[socket.id].rotation = data[1];
        }
      });

      // Relay simple-peer signals back and forth
      socket.on("signal", (to, from, data) => {
        if (to in peers) {
          io.to(to).emit("signal", to, from, data);
        } else {
          console.log("Peer not found!");
        }
      });

      // Handle the disconnection
      socket.on("disconnect", () => {
        // Delete this client from the object
        delete peers[socket.id];
        io.sockets.emit(
          "userDisconnected",
          io.engine.clientsCount,
          socket.id,
          Object.keys(peers)
        );
        console.log(
          "User " +
            socket.id +
            " disconnected, there are " +
            io.engine.clientsCount +
            " clients connected"
        );
      });
    });
  };

  const initSocket = () => {
    const socket = initSocketConnection((clientId) => {
      // Lógica para agregar un cliente
      console.log("Adding client with id:", clientId);
    });
    // Almacenar el socket en el estado
    setMySocket(socket);
  };
  const createPeerConnection = (
    theirSocketId,
    isInitiator = false,
    mySocket,
    localMediaStream
  ) => {
    console.log("Connecting to peer with ID", theirSocketId);
    console.log("initiating?", isInitiator);

    let peerConnection = new SimplePeer({ initiator: isInitiator });
    // simplepeer generates signals which need to be sent across socket
    peerConnection.on("signal", (data) => {
      // console.log('signal');
      mySocket.emit("signal", theirSocketId, mySocket.id, data);
    });

    // When we have a connection, send our stream
    peerConnection.on("connect", () => {
      // Let's give them our stream
      peerConnection.addStream(localMediaStream);
      console.log("Send our stream");
    });

    // Stream coming in to us
    peerConnection.on("stream", (stream) => {
      console.log("Incoming Stream");

      aulaService.updateClientMediaElements(theirSocketId, stream);
    });

    peerConnection.on("close", () => {
      console.log("Got close event");
      // Should probably remove from the array of simplepeers
    });

    peerConnection.on("error", (err) => {
      console.log(err);
    });

    return peerConnection;
  };
  const initSocketConnection = () => {
    console.log("Initializing socket.io...");

    const mySocket = io();

    mySocket.on("connect", () => {
      console.log("My socket ID:", mySocket.id);
    });

    mySocket.on("introduction", (otherClientIds) => {
      // for each existing user, add them as a client and add tracks to their peer connection
      for (let i = 0; i < otherClientIds.length; i++) {
        if (otherClientIds[i] !== mySocket.id) {
          let theirId = otherClientIds[i];

          console.log("Adding client with id " + theirId);
          peers[theirId] = {};

          let pc = createPeerConnection(theirId, true, mySocket);
          peers[theirId].peerConnection = pc;

          aulaService.createClientMediaElements(theirId);

          addClient(theirId);
        }
      }
    });
    mySocket.on("userDisconnected", (clientCount, _id, _ids) => {
      // Update the data from the server

      if (_id !== mySocket.id) {
        console.log("A user disconnected with the id: " + _id);
        removeClient(_id);
        aulaService.removeClientVideoElementAndCanvas(_id);
        delete peers[_id];
      }
    });

    mySocket.on("signal", (to, from, data) => {
      // console.log("Got a signal from the server: ", to, from, data);

      // to should be us
      if (to !== mySocket.id) {
        console.log("Socket IDs don't match");
      }

      // Look for the right simplepeer in our array
      let peer = peers[from];
      if (peer.peerConnection) {
        peer.peerConnection.signal(data);
      } else {
        console.log("Never found right simplepeer object");
        // Let's create it then, we won't be the "initiator"
        // let theirSocketId = from;
        let peerConnection = createPeerConnection(from, false);

        peers[from].peerConnection = peerConnection;

        // Tell the new simplepeer that signal
        peerConnection.signal(data);
      }
    });
    // Update when one of the users moves in space
    mySocket.on("positions", (_clientProps) => {
      updateClientPositions(_clientProps);
    });
    // Clean up socket on component unmount
    return () => {
      mySocket.disconnect();
    };
  };
  const startSendingPositionData = () => {
    setInterval(() => {
      const mySocket = io();
      // Llamar al método updateClientPositions pasando la posición actual del jugador
      mySocket.emit("move", aulaScene.getPlayerPosition());
      //updateClientPositions(getPlayerPosition());
    }, 200);
  };
  const addClient = (id) => {
    const videoMaterial = this.makeVideoMaterial(id);
    const otherMat = new THREE.MeshNormalMaterial();

    const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      videoMaterial,
    ]);

    // set position of head before adding to parent object
    head.position.set(0, 0, 0);

    // https://threejs.org/docs/index.html#api/en/objects/Group
    const group = new THREE.Group();
    group.add(head);

    // add group to scene
    this.scene.add(group);

    // Actualizar el estado
    this.setState((prevState) => ({
      clients: [...prevState.clients, { id, group }],
    }));

    // Update local state for the current client
    const { clients } = this.state;
    const currentClient = clients.find((client) => client.id === id);
    if (currentClient) {
      peers[id] = {
        group: currentClient.group,
        previousPosition: new THREE.Vector3(),
        previousRotation: new THREE.Quaternion(),
        desiredPosition: new THREE.Vector3(),
        desiredRotation: new THREE.Quaternion(),
      };
    }
  };

  const removeClient = (id) => {
    // Eliminar del estado
    this.setState((prevState) => ({
      clients: prevState.clients.filter((client) => client.id !== id),
    }));

    // Eliminar del local state
    delete peers[id];

    // Eliminar del escenario
    this.scene.remove(peers[id].group);
  };

  const updateClientPositions = (clientProperties) => {
    this.lerpValue = 0;
    for (let id in clientProperties) {
      if (id !== mySocket.id) {
        const { clients } = this.state;
        const currentClient = clients.find((client) => client.id === id);
        if (currentClient) {
          peers[id].previousPosition.copy(currentClient.group.position);
          peers[id].previousRotation.copy(currentClient.group.quaternion);
          peers[id].desiredPosition = new THREE.Vector3().fromArray(
            clientProperties[id].position
          );
          peers[id].desiredRotation = new THREE.Quaternion().fromArray(
            clientProperties[id].rotation
          );
        }
      }
    }
  };

  return (
    <SocketContext.Provider
      value={{
        mySocket,
        initSocket,
        createPeerConnection,
        initSocketConnection,
        startSendingPositionData,
        addClient,
        removeClient,
        updateClientPositions,
        setupSocketServer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
