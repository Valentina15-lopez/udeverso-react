import React, { Component } from "react";
import * as THREE from "three";
import { createEnvironment } from "../../../config/environment";
import AulaService from "../../../server/logic/AulaService";

class AulaScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };

    //THREE scene
    this.scene = new THREE.Scene();

    // Inicializar el ref del renderer
    this.rendererRef = React.createRef();

    // Inicializar el renderer u otras configuraciones...
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true,
    });

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

    this.renderer.setClearColor(new THREE.Color("lightblue"));
    this.renderer.setSize(this.width, this.height);
    // add controls
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    // Crear el contexto de audio después de un gesto del usuario
    this.renderer.domElement.addEventListener("click", () => {
      this.camera.add(this.listener);
    });

    // Estado del teclado
    this.keyState = {};

    // En lugar de usar FirstPersonControls, maneja la lógica de los controles de cámara manualmente

    // Variables para el control manual de la cámara
    var cameraRotationSpeed = 0.005;
    var cameraMoveSpeed = 2;

    // Inicializa tus objetos Three.js (scene, camera, renderer) y comienza el bucle de renderizado
    this.updateCameraControls = this.updateCameraControls.bind(this);
    this.update();

    // Helpers
    this.scene.add(new THREE.GridHelper(500, 500));
    this.scene.add(new THREE.AxesHelper(10));

    this.addLights();
    createEnvironment(this.scene);
  }
  // Estado del teclado
  handleKeyDown(event) {
    this.keyState[event.code] = true;
  }

  handleKeyUp(event) {
    this.keyState[event.code] = false;
  }
  // Función de actualización de los controles de la cámara (llamada en tu bucle de renderización)
  updateCameraControls = () => {
    // Usa `this` correctamente dentro de esta función para acceder a las propiedades del componente
    if (this.keyState["ArrowLeft"]) {
      this.camera.rotation.y += 0.005;
    }
    if (this.keyState["ArrowRight"]) {
      this.camera.rotation.y -= 0.005;
    }
    if (this.keyState["ArrowUp"]) {
      this.camera.translateZ(-2);
    }
    if (this.keyState["ArrowDown"]) {
      this.camera.translateZ(2);
    }
  };
  getPlayerPosition() {
    // TODO: use quaternion or are euler angles fine here?
    return [
      [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      [
        this.camera.quaternion._x,
        this.camera.quaternion._y,
        this.camera.quaternion._z,
        this.camera.quaternion._w,
      ],
    ];
  }

  componentDidMount() {
    // Append the renderer to the DOM after the component has mounted
    if (this.rendererRef && this.rendererRef.current) {
      this.rendererRef.current.appendChild(this.renderer.domElement);
    }

    // Setup event listeners for events and handle the states
    window.addEventListener("resize", this.onWindowResize, false);
    // Iniciar el streaming de video y audio
    const aulaService = new AulaService();
    aulaService.init();
    // Eventos para el teclado
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    // Start the loop
    this.frameCount = 0;
    this.update();
  }

  componentWillUnmount() {
    // Clean up event listeners and any other resources when the component is unmounted
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
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
    this.updateCameraControls();
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

  render() {
    return <div ref={this.rendererRef}></div>;
  }
}

export default AulaScene;
