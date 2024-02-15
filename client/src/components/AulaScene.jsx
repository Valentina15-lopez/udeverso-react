import React, { useRef, useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Vector3, Quaternion } from "three";
import { useSocketManager } from "./SocketManager";

const AulaScene = () => {
  const ref = useRef();

  function useKeyboard() {
    const keyMap = useRef({});

    useEffect(() => {
      const onDocumentKey = (e) => {
        keyMap.current[e.code] = e.type === "keydown";
      };
      document.addEventListener("keydown", onDocumentKey);
      document.addEventListener("keyup", onDocumentKey);
      return () => {
        document.removeEventListener("keydown", onDocumentKey);
        document.removeEventListener("keyup", onDocumentKey);
      };
    });

    return keyMap.current;
  }

  function Ball({ userId, floor }) {
    const ref = useRef();
    const keyMap = useKeyboard();

    const v = useMemo(() => new Vector3(), []);
    const q = useMemo(() => new Quaternion(), []);
    const angularVelocity = useMemo(() => new Vector3(), []);

    useFrame((_, delta) => {
      keyMap["KeyW"] && (angularVelocity.x -= delta * 5);
      keyMap["KeyS"] && (angularVelocity.x += delta * 5);
      keyMap["KeyA"] && (angularVelocity.z += delta * 5);
      keyMap["KeyD"] && (angularVelocity.z -= delta * 5);

      q.setFromAxisAngle(angularVelocity, delta).normalize();
      ref.current.applyQuaternion(q);

      angularVelocity.lerp(v, 0.01); // slow down the roll

      floor.current.position.x += angularVelocity.z * delta;
      floor.current.position.z -= angularVelocity.x * delta;

      floor.current.position.x = floor.current.position.x % 10;
      floor.current.position.z = floor.current.position.z % 10;
    });
    const userColor = useMemo(
      () => "#" + ((userId + 1) * 16777215).toString(16),
      [userId]
    );
    return (
      <mesh ref={ref} position-y={1.0}>
        <sphereGeometry />
        <meshNormalMaterial wireframe color={userColor} />
      </mesh>
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 2.5, 2.5] }}
        onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
      >
        <gridHelper ref={ref} args={[100, 100]} />
        <Ball floor={ref} />
      </Canvas>
    </>
  );
};

export default AulaScene;
