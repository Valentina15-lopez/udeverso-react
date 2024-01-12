import React, { useEffect, useRef, useCallback } from "react";
//import { Scene } from "three";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { peers } from "../../../";

const AulaService = ({
  addClient,
  removeClient,
  updateClientPositions,
  getPlayerPosition,
}) => {
  //const myScene = useRef(new Scene());
  const localMediaStream = useRef(null);

  const videoWidth = 80;
  const videoHeight = 60;
  const videoFrameRate = 15;

  const mediaConstraints = {
    audio: true,
    video: {
      width: videoWidth,
      height: videoHeight,
      frameRate: videoFrameRate,
    },
  };
  const createPeerConnection = useCallback(
    (theirSocketId, isInitiator = false, mySocket) => {
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

        updateClientMediaElements(theirSocketId, stream);
      });

      peerConnection.on("close", () => {
        console.log("Got close event");
        // Should probably remove from the array of simplepeers
      });

      peerConnection.on("error", (err) => {
        console.log(err);
      });

      return peerConnection;
    },
    []
  );
  const initSocketConnection = useCallback(() => {
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

          createClientMediaElements(theirId);

          addClient(theirId);
        }
      }
    });
    mySocket.on("userDisconnected", (clientCount, _id, _ids) => {
      // Update the data from the server

      if (_id !== mySocket.id) {
        console.log("A user disconnected with the id: " + _id);
        removeClient(_id);
        removeClientVideoElementAndCanvas(_id);
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
  }, [addClient, createPeerConnection, removeClient, updateClientPositions]);
  const startSendingPositionData = useCallback(() => {
    setInterval(() => {
      const mySocket = io();
      // Llamar al método updateClientPositions pasando la posición actual del jugador
      mySocket.emit("move", getPlayerPosition());
      //updateClientPositions(getPlayerPosition());
    }, 200);
  }, [getPlayerPosition]);

  useEffect(() => {
    const init = async () => {
      console.log("Window loaded.");

      localMediaStream.current = await getMedia(mediaConstraints);
      createLocalVideoElement();
      initSocketConnection();

      console.log("Creating three.js scene...");
      startSendingPositionData();
    };

    init();

    return () => {
      // Cleanup logic (if needed)
    };
  }, [
    addClient,
    createPeerConnection,
    removeClient,
    updateClientPositions,
    initSocketConnection,
    mediaConstraints,
    startSendingPositionData,
  ]);
  const getMedia = async (_mediaConstraints) => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(_mediaConstraints);
    } catch (err) {
      console.log("Failed to get user media!");
      console.warn(err);
    }

    return stream;
  };

  const createLocalVideoElement = () => {
    const videoElement = document.createElement("video");
    videoElement.id = "local_video";
    videoElement.autoplay = true;
    videoElement.width = videoWidth;
    videoElement.height = videoHeight;

    if (localMediaStream.current) {
      const videoStream = new MediaStream([
        localMediaStream.current.getVideoTracks()[0],
      ]);
      videoElement.srcObject = videoStream;
    }

    document.body.appendChild(videoElement);
  };

  // temporarily pause the outgoing stream
  /* const disableOutgoingStream = () => {
    localMediaStream.getTracks().forEach((track) => {
      track.enabled = false;
    });
  };*/
  // enable the outgoing stream
  /*const enableOutgoingStream = () => {
    localMediaStream.getTracks().forEach((track) => {
      track.enabled = true;
    });
  };*/

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Utilities 🚂

  // created <video> element using client ID
  const createClientMediaElements = (_id) => {
    console.log("Creating <html> media elements for client with ID: " + _id);

    const videoElement = document.createElement("video");
    videoElement.id = _id + "_video";
    videoElement.autoplay = true;
    // videoElement.style = "visibility: hidden;";

    document.body.appendChild(videoElement);

    // create audio element for client
    let audioEl = document.createElement("audio");
    audioEl.setAttribute("id", _id + "_audio");
    audioEl.controls = "controls";
    audioEl.volume = 1;
    document.body.appendChild(audioEl);

    audioEl.addEventListener("loadeddata", () => {
      audioEl.play();
    });
  };

  const updateClientMediaElements = (_id, stream) => {
    let videoStream = new MediaStream([stream.getVideoTracks()[0]]);
    let audioStream = new MediaStream([stream.getAudioTracks()[0]]);

    const videoElement = document.getElementById(_id + "_video");
    videoElement.srcObject = videoStream;

    let audioEl = document.getElementById(_id + "_audio");
    audioEl.srcObject = audioStream;
  };

  // remove <video> element and corresponding <canvas> using client ID
  const removeClientVideoElementAndCanvas = (_id) => {
    console.log("Removing <video> element for client with id: " + _id);

    let videoEl = document.getElementById(_id + "_video");
    if (videoEl !== null) {
      videoEl.remove();
    }
  };

  return <div>Aula services Component</div>;
};

export default AulaService;
