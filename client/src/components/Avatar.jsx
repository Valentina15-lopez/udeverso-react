import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useKeyPress } from "./useKeyPress"; // Importa el hook useKeyPress
import * as THREE from "three"; // Importa THREE para utilizar Vectores
import { socket } from "./../context/ContexProvider";

const MOVEMENT_SPEED = 0.1; //0.032;

export function Avatar({
  user,
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  ...props
}) {
  const position = useMemo(() => props.position, []);

  const group = useRef();
  const { scene, materials, animations } = useGLTF("/models/AnimatedWoman.glb");

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  const initialRotation = useRef(); // Almaceno la rotación inicial

  const moveAvatar = (direction) => {
    const newPosition = group.current.position.clone().add(direction);
    group.current.position.copy(newPosition);
    setAnimation("CharacterArmature|Run");
    // Enviar la nueva posición al servidor a través del socket
    socket.emit("move", { id: user.id, position: newPosition.toArray() });
  };

  useEffect(() => {
    initialRotation.current = group.current.rotation.clone(); // Almacena la rotación inicial
  }, []);

  // Detecta las teclas presionadas
  const [keysPressed, setKeysPressed] = useState({});

  const handleKeyDown = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: true }));
  };

  const handleKeyUp = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: false }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    let moveDirection = new THREE.Vector3();

    if (keysPressed["KeyW"]) {
      moveDirection.z = -1;
    } else if (keysPressed["KeyS"]) {
      moveDirection.z = 1;
    }

    if (keysPressed["KeyA"]) {
      moveDirection.x = -1;
    } else if (keysPressed["KeyD"]) {
      moveDirection.x = 1;
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      const newRotation = Math.atan2(moveDirection.x, moveDirection.z);
      group.current.rotation.y = newRotation;
      moveAvatar(moveDirection.multiplyScalar(MOVEMENT_SPEED));
      setAnimation("CharacterArmature|Run");
    } else {
      setAnimation("CharacterArmature|Idle");
    }
  });

  return (
    <group ref={group} {...props} position={position} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.White}
              skeleton={nodes.Casual_Body_1.skeleton}
            >
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Body_2"
              geometry={nodes.Casual_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Body_2.skeleton}
            />
          </group>
          <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={nodes.Casual_Feet_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Feet_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={nodes.Casual_Feet_2.geometry}
              material={materials.Grey}
              skeleton={nodes.Casual_Feet_2.skeleton}
            />
          </group>
          <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Head_1"
              geometry={nodes.Casual_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Head_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={nodes.Casual_Head_2.geometry}
              material={materials.Hair_Blond}
              skeleton={nodes.Casual_Head_2.skeleton}
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Hair_Brown}
              skeleton={nodes.Casual_Head_3.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Brown}
              skeleton={nodes.Casual_Head_4.skeleton}
            />
          </group>
          <skinnedMesh
            name="Casual_Legs"
            geometry={nodes.Casual_Legs.geometry}
            material={materials.Orange}
            skeleton={nodes.Casual_Legs.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <meshStandardMaterial color={bottomColor} />
          </skinnedMesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/AnimatedWoman.glb");
