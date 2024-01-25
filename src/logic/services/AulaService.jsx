import React, { Component } from "react";
import { useSocket } from "../../logic/services/SocketContext";

class AulaService extends Component {
  constructor(props) {
    super(props);

    this.localMediaStream = React.createRef();
    this.videoWidth = 80;
    this.videoHeight = 60;
    this.videoFrameRate = 15;

    this.mediaConstraints = {
      audio: true,
      video: {
        width: this.videoWidth,
        height: this.videoHeight,
        frameRate: this.videoFrameRate,
      },
    };

    this.state = {
      // Puedes inicializar el estado si es necesario
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    // Cleanup logic (si es necesario)
  }

  init = async () => {
    //const { initSocketConnection } = useSocket();&&arreglar esto
    console.log("Window loaded.");

    this.localMediaStream.current = await this.getMedia(this.mediaConstraints);
    this.createLocalVideoElement();
    //initSocketConnection();

    console.log("Creating three.js scene...");
  };

  getMedia = async (_mediaConstraints) => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(_mediaConstraints);
    } catch (err) {
      console.log("Failed to get user media!");
      console.warn(err);
    }

    return stream;
  };

  createLocalVideoElement = () => {
    const videoElement = document.createElement("video");
    videoElement.id = "local_video";
    videoElement.autoplay = true;
    videoElement.width = this.videoWidth;
    videoElement.height = this.videoHeight;

    if (this.localMediaStream.current) {
      const videoStream = new MediaStream([
        this.localMediaStream.current.getVideoTracks()[0],
      ]);
      videoElement.srcObject = videoStream;
    }

    document.body.appendChild(videoElement);
  };

  render() {
    return <div>Aula services Component</div>;
  }
}

export default AulaService;
