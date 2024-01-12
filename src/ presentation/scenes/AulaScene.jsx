import React, { Component } from "react";
import * as THREE from "three";
import { peers } from "../../logic/services/server";
import { createEnvironment } from "../../logic/services/environment";
import AulaService from "../../logic/services/AulaService";
import { useSocket } from "../../logic/services/SocketContext";

class AulaScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };

    //THREE scene
    this.scene = new THREE.Scene();

    //Utility
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.9;

    // lerp value to be used when interpolating positions and rotations
    this.lerpValue = 0;

    //THREE Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      5000
    );
    this.camera.position.set(0, 3, 6);
    this.scene.add(this.camera);

    // create an AudioListener and add it to the camera
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    //THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true,
    });
    this.renderer.setClearColor(new THREE.Color("lightblue"));
    this.renderer.setSize(this.width, this.height);

    // add controls:
    // En lugar de usar FirstPersonControls, maneja la lógica de los controles de cámara manualmente

    // Variables para el control manual de la cámara
    var cameraRotationSpeed = 0.005;
    var cameraMoveSpeed = 2;

    // Eventos para el teclado
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Estado del teclado
    var keyState = {};

    function handleKeyDown(event) {
      keyState[event.code] = true;
    }

    function handleKeyUp(event) {
      keyState[event.code] = false;
    }

    // Función de actualización de los controles de la cámara (llamada en tu bucle de renderización)
    function updateCameraControls() {
      // Rotación de la cámara
      if (keyState["ArrowLeft"]) {
        this.camera.rotation.y += cameraRotationSpeed;
      }
      if (keyState["ArrowRight"]) {
        this.camera.rotation.y -= cameraRotationSpeed;
      }

      // Movimiento hacia adelante/atrás
      if (keyState["ArrowUp"]) {
        this.camera.translateZ(-cameraMoveSpeed);
      }
      if (keyState["ArrowDown"]) {
        this.camera.translateZ(cameraMoveSpeed);
      }
    }

    // Inicializa tus objetos Three.js (scene, camera, renderer) y comienza el bucle de renderizado
    updateCameraControls();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderer.render);
    // Attach the renderer to a React ref
    this.rendererRef = React.createRef();

    // Helpers
    this.scene.add(new THREE.GridHelper(500, 500));
    this.scene.add(new THREE.AxesHelper(10));

    this.addLights();
    createEnvironment(this.scene);
  }

  componentDidMount() {
    // Append the renderer to the DOM after the component has mounted
    this.rendererRef.current.appendChild(this.renderer.domElement);

    // Setup event listeners for events and handle the states
    window.addEventListener("resize", this.onWindowResize, false);

    // Start the loop
    this.frameCount = 0;
    this.update();
  }

  componentWillUnmount() {
    // Clean up event listeners and any other resources when the component is unmounted
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    // Handle window resize events
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.9;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  };

  update = () => {
    // Your update logic goes here

    // Call requestAnimationFrame to update the scene continuously
    requestAnimationFrame(this.update);

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  };

  addLights = () => {
    this.scene.add(new THREE.AmbientLight(0xffffe6, 0.7));
  };
  makeVideoMaterial = (id) => {
    let videoElement = document.getElementById(id + "_video");
    let videoTexture = new THREE.VideoTexture(videoElement);

    let videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      overdraw: true,
      side: THREE.DoubleSide,
    });
    return videoMaterial;
  };
  addClient = (id) => {
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

  removeClient = (id) => {
    // Eliminar del estado
    this.setState((prevState) => ({
      clients: prevState.clients.filter((client) => client.id !== id),
    }));

    // Eliminar del local state
    delete peers[id];

    // Eliminar del escenario
    this.scene.remove(peers[id].group);
  };

  updateClientPositions = (clientProperties) => {
    const { mySocket, initSocket, disconnectSocket } = useSocket();
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

  render() {
    return (
      <div>
        <AulaService
          addClient={this.addClient}
          removeClient={this.removeClient}
          updateClientPositions={this.updateClientPositions}
        />
      </div>
    );
  }
}

export default AulaScene;
