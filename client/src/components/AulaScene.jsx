import React, { useRef, useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";

const AulaScene = () => {
  const ref = useRef();
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <OrbitControls />
      <gridHelper
        ref={ref}
        args={[100, 100]}
        position-y={-0.001}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      />
    </>
  );
};

export default AulaScene;
