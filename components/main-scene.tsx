"use client"

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import type { Group } from "three";

export default function MainScene() {
  // Track mouse position for parallax effect
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      <ambientLight intensity={1} />
      <GridPoints mouse={mouse} />
      <FloatingParticles mouse={mouse} />
      <AnimatedGlobe />
    </Canvas>
  );
}

function AnimatedGlobe() {
  const globeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      // Remove any parallax or mouse-based movement from the globe
      globeRef.current.position.x = 0;
      globeRef.current.position.z = 0;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[8, 32, 32]}>
        <MeshDistortMaterial
          color="#14b8a6"
          attach="material"
          distort={0.3}
          speed={2}
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
}

function GridPoints({ mouse }: { mouse: { x: number; y: number } }) {
  const [points, setPoints] = useState<Array<[number, number, number]>>([]);
  const animatedPositions = useRef<Array<[number, number, number]>>([]);

  useEffect(() => {
    const gridSize = 8;
    const spacing = 1;
    const newPoints: Array<[number, number, number]> = [];
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        const distance = Math.sqrt(x * x + z * z);
        if (distance > 5) {
          newPoints.push([x, -3, z]);
        }
      }
    }
    setPoints(newPoints);
    animatedPositions.current = newPoints.map((p) => [...p] as [number, number, number]);
  }, []);

  useFrame(() => {
    points.forEach((base, i) => {
      // Calculate target position with parallax
      const targetX = base[0] + mouse.x * 2;
      const targetZ = base[2] + mouse.y * 2;
      // Lerp each dot's position
      animatedPositions.current[i][0] += (targetX - animatedPositions.current[i][0]) * 0.04;
      animatedPositions.current[i][2] += (targetZ - animatedPositions.current[i][2]) * 0.04;
    });
  });

  return (
    <group>
      {points.map((_, i) => (
        <mesh key={i} position={animatedPositions.current[i]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingParticles({ mouse }: { mouse: { x: number; y: number } }) {
  const particlesRef = useRef<Group>(null);
  const [particles, setParticles] = useState<
    Array<{
      position: [number, number, number];
      speed: number;
      size: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const count = 40; // reduced particles for memory safety
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 10;

      newParticles.push({
        position: [x, y, z] as [number, number, number],
        speed: 0.2 + Math.random() * 0.3,
        size: 0.05 + Math.random() * 0.1,
        color: Math.random() > 0.7 ? "#14b8a6" : "#f0f0f0",
      });
    }
    setParticles(newParticles);
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      // Smooth parallax effect
      particlesRef.current.position.x += ((mouse.x * 1.5) - particlesRef.current.position.x) * 0.04;
      particlesRef.current.position.z += ((mouse.y * 1.5) - particlesRef.current.position.z) * 0.04;
      particlesRef.current.children.forEach((particle, i) => {
        const data = particles[i];
        particle.position.y += data.speed * 0.02;
        if (particle.position.y > 5) {
          particle.position.y = -5;
        }
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
