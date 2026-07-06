"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Decal } from "@react-three/drei";
import * as THREE from "three";

// Suppress THREE.Clock deprecation warning from internal react-three-fiber usage
if (typeof console !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
      return;
    }
    originalWarn(...args);
  };
}

function PotModel() {
  const meshRef = useRef<THREE.Group>(null);
  const [decalTexture, setDecalTexture] = useState<THREE.CanvasTexture | null>(null);

  // Create a canvas texture for the engraved Bengali text
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 256);
      
      // Use a very dark brown/black for the engraved look
      ctx.fillStyle = "#2c1404"; 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 130px system-ui, -apple-system, sans-serif";
      
      // Text shadow for an embossed/engraved depth effect on the texture itself
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText("মাটির রাজ্য", 512, 128);
      
      // Decorative border lines
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#2c1404";
      ctx.beginPath(); ctx.moveTo(150, 40); ctx.lineTo(874, 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 216); ctx.lineTo(874, 216); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    setDecalTexture(texture);
  }, []);

  // Rotate the entire group slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Create a highly detailed curve for a traditional Matir Motka (মাটির মটকা)
  const points = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0, 0)); // Center bottom
    pts.push(new THREE.Vector2(1.2, 0)); // Base radius
    pts.push(new THREE.Vector2(1.3, 0.2)); // Base lip
    pts.push(new THREE.Vector2(1.2, 0.4)); // Base indent

    // Belly of the pot (fat and round)
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      // Start at 1.2, bulge out to ~2.8, then narrow to 0.8
      const x = 1.2 + Math.sin(t * Math.PI) * 1.6 - (t * 0.4); 
      const y = 0.4 + t * 4.0;
      pts.push(new THREE.Vector2(x, y));
    }
    
    // Neck
    pts.push(new THREE.Vector2(0.8, 4.6));
    pts.push(new THREE.Vector2(0.85, 4.8));
    
    // Flared Rim
    pts.push(new THREE.Vector2(1.4, 5.0)); // Outer rim
    pts.push(new THREE.Vector2(1.45, 5.1)); // Top outer edge
    pts.push(new THREE.Vector2(1.35, 5.15)); // Top inner edge
    pts.push(new THREE.Vector2(0.7, 4.7)); // Inner neck
    pts.push(new THREE.Vector2(0.65, 4.4)); // Inside drop
    
    return pts;
  }, []);

  return (
    <group ref={meshRef} position={[0, -2.5, 0]}>
      {/* The Clay Pot */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 128]} />
        <meshStandardMaterial
          color="#b3623b" // Traditional terracotta clay color
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide} // Ensures inside of pot is rendered and visible
        />
        
        {/* Front Engraved Text Decal */}
        {decalTexture && (
          <Decal position={[0, 2.4, 2.8]} rotation={[0, 0, 0]} scale={[4, 1.2, 2]}>
            <meshStandardMaterial
              map={decalTexture}
              bumpMap={decalTexture}
              bumpScale={0.08}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
              roughness={0.9}
            />
          </Decal>
        )}

        {/* Back Engraved Text Decal */}
        {decalTexture && (
          <Decal position={[0, 2.4, -2.8]} rotation={[0, Math.PI, 0]} scale={[4, 1.2, 2]}>
            <meshStandardMaterial
              map={decalTexture}
              bumpMap={decalTexture}
              bumpScale={0.08}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
              roughness={0.9}
            />
          </Decal>
        )}
      </mesh>
    </group>
  );
}

export function ClayPotScene() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] cursor-grab active:cursor-grabbing">
      {/* Moved camera back to Z=12 and slightly up to prevent clipping */}
      <Canvas camera={{ position: [0, 2.5, 12], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#ffd700" />
        <Environment preset="city" />
        <PotModel />
        <ContactShadows
          position={[0, -2.51, 0]} // Positioned exactly below the pot's base
          opacity={0.8}
          scale={15}
          blur={2.5}
          far={5}
        />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4} // Allows seeing slightly more of the inside
          maxPolarAngle={Math.PI / 2 + 0.1}
          autoRotate 
          autoRotateSpeed={1.0} 
        />
      </Canvas>
    </div>
  );
}
