// "use client"
// import React, { useRef, useMemo, useState } from 'react';
// import { useFrame, useThree, Canvas } from '@react-three/fiber';
// import { ScrollControls, useScroll, Stars, Float, PerspectiveCamera, Environment, MeshTransmissionMaterial, Text, Trail, Sparkles, Scroll } from '@react-three/drei';
// import * as THREE from 'three';
// import { Overlay } from './Overlay';

// // --- SUB-COMPONENTS ---

// // 1. THE EARTH (Procedural)
// const Earth = () => {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const glowRef = useRef<THREE.Mesh>(null);

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.05;
//     }
//     if (glowRef.current) {
//       glowRef.current.lookAt(state.camera.position);
//     }
//   });

//   return (
//     <group position={[0, -2, -5]} scale={2}>
//       {/* Main Sphere */}
//       <mesh ref={meshRef}>
//         <sphereGeometry args={[2, 64, 64]} />
//         <meshPhysicalMaterial
//           color="#1a1a1a"
//           emissive="#001133"
//           emissiveIntensity={0.5}
//           roughness={0.7}
//           metalness={0.1}
//           clearcoat={0.5}
//           clearcoatRoughness={0.1}
//         />
//       </mesh>

//       {/* Atmosphere Glow (Rim light helper) */}
//       <mesh ref={glowRef} scale={1.1}>
//         <sphereGeometry args={[2, 64, 64]} />
//         <meshBasicMaterial
//           color="#4ca6ff"
//           transparent
//           opacity={0.1}
//           side={THREE.BackSide}
//           blending={THREE.AdditiveBlending}
//         />
//       </mesh>

//       {/* Procedural Clouds/Atmosphere Rings */}
//       <mesh rotation={[Math.PI / 2, 0, 0]}>
//         <torusGeometry args={[2.5, 0.01, 16, 100]} />
//         <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
//       </mesh>
//       <mesh rotation={[Math.PI / 2.2, 0, 0]}>
//         <torusGeometry args={[2.8, 0.005, 16, 100]} />
//         <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
//       </mesh>
//     </group>
//   );
// };

// // 2. THE SPACESHIP (Apple Aesthetics)
// const Spaceship = () => {
//   const shipRef = useRef<THREE.Group>(null);
//   const scroll = useScroll();

//   useFrame((state) => {
//     if (!shipRef.current) return;

//     // Subtle float
//     shipRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
//     shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

//     // Mouse interaction (Ship tilts towards mouse)
//     const mouseX = state.mouse.x * 0.5;
//     const mouseY = state.mouse.y * 0.5;
//     shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, mouseX, 0.1);
//     shipRef.current.rotation.x = THREE.MathUtils.lerp(shipRef.current.rotation.x, -mouseY, 0.1);
//   });

//   const bodyMaterial = new THREE.MeshPhysicalMaterial({
//     color: '#111111',
//     roughness: 0.15,
//     metalness: 0.9,
//     clearcoat: 1,
//     clearcoatRoughness: 0.1,
//     envMapIntensity: 1.5,
//   });

//   const glassMaterial = new THREE.MeshPhysicalMaterial({
//     color: '#000',
//     transmission: 1,
//     roughness: 0,
//     thickness: 0.5,
//     ior: 1.5,
//   });

//   return (
//     <group ref={shipRef} position={[0, 0, 0]} scale={0.8}>
//       {/* Main Hull - Unibody Aluminum/Ceramic feel */}
//       <mesh position={[0, 0, 0]} castShadow receiveShadow material={bodyMaterial}>
//         <capsuleGeometry args={[0.5, 2, 4, 16]} />
//       </mesh>

//       {/* Cockpit Window */}
//       <mesh position={[0, 0.4, 0.35]} rotation={[0.5, 0, 0]}>
//         <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
//         <primitive object={glassMaterial} />
//       </mesh>

//       {/* Engine Rings (Glowing) */}
//       <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
//         <torusGeometry args={[0.3, 0.05, 16, 32]} />
//         <meshBasicMaterial color="#00ffff" toneMapped={false} />
//       </mesh>

//       {/* Engine Particle Trail */}
//       <group position={[0, -1.5, 0]}>
//         <Sparkles
//           count={50}
//           scale={2}
//           size={2}
//           speed={0.4}
//           opacity={0.5}
//           color="#00ffff"
//           noise={0.5}
//         />
//       </group>
//     </group>
//   );
// };

// // 3. SNOOPY ASTRONAUT (Easter Egg)
// const AstronautDog = () => {
//   const ref = useRef<THREE.Group>(null);
//   useFrame((state, delta) => {
//     if (ref.current) {
//       ref.current.rotation.y += delta * 0.2;
//       ref.current.rotation.z += delta * 0.1;
//       ref.current.position.y += Math.sin(state.clock.elapsedTime) * 0.001;
//     }
//   });

//   const suitMat = new THREE.MeshStandardMaterial({ color: "white", roughness: 0.4 });

//   return (
//     <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
//       <group ref={ref} position={[3, 1, -10]} scale={0.3}>
//         {/* Head */}
//         <mesh material={suitMat} position={[0, 0.6, 0]}>
//           <sphereGeometry args={[0.4, 32, 32]} />
//         </mesh>
//         {/* Visor */}
//         <mesh position={[0, 0.6, 0.3]}>
//           <sphereGeometry args={[0.2, 32, 32]} />
//           <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
//         </mesh>
//         {/* Ears */}
//         <mesh material={suitMat} position={[-0.35, 0.5, 0]} rotation={[0, 0, 0.5]}>
//           <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
//         </mesh>
//         <mesh material={suitMat} position={[0.35, 0.5, 0]} rotation={[0, 0, -0.5]}>
//           <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
//         </mesh>
//         {/* Body */}
//         <mesh material={suitMat} position={[0, 0, 0]}>
//           <cylinderGeometry args={[0.3, 0.3, 0.7, 32]} />
//         </mesh>
//       </group>
//     </Float>
//   );
// };

// // 4. FLOATING MONOLITHS (Work Background)
// const FloatingMonoliths = () => {
//   const group = useRef<THREE.Group>(null);

//   useFrame(({ clock }) => {
//     if (group.current) {
//       group.current.children.forEach((child, i) => {
//         child.position.y += Math.sin(clock.elapsedTime * 0.5 + i) * 0.002;
//         child.rotation.x += 0.001;
//         child.rotation.y += 0.001;
//       });
//     }
//   });

//   const mat = new THREE.MeshPhysicalMaterial({
//     color: "#1a1a1a",
//     transmission: 0.2,
//     roughness: 0.1,
//     metalness: 0.5,
//     thickness: 2,
//   });

//   return (
//     <group ref={group} position={[0, 0, -10]}>
//       <mesh position={[-4, 2, -2]} rotation={[0.5, 0.5, 0]} material={mat}>
//         <boxGeometry args={[1, 3, 0.2]} />
//       </mesh>
//       <mesh position={[4, -1, -5]} rotation={[-0.5, -0.2, 0]} material={mat}>
//         <boxGeometry args={[1.5, 4, 0.2]} />
//       </mesh>
//       <mesh position={[-3, -3, 0]} rotation={[0, 0, 0.5]} material={mat}>
//         <boxGeometry args={[0.5, 2, 0.5]} />
//       </mesh>
//     </group>
//   );
// };

// // 5. UFO (Easter Egg 2)
// const UFO = () => {
//   const ufoRef = useRef<THREE.Group>(null);
//   const ufoData = useRef({
//     active: false,
//     startTime: 0,
//     direction: 1, // 1 or -1
//     speed: 10,
//     y: 0,
//     z: -20,
//     scale: 1
//   });

//   useFrame(({ clock }) => {
//     if (!ufoRef.current) return;
//     const state = ufoData.current;
//     const time = clock.elapsedTime;

//     if (!state.active) {
//       // Random chance to spawn (approx every 10-15 seconds at 60fps)
//       if (Math.random() < 0.002) {
//         state.active = true;
//         state.startTime = time;
//         state.direction = Math.random() > 0.5 ? 1 : -1;
//         state.speed = 10 + Math.random() * 20;
//         state.y = THREE.MathUtils.randFloat(-8, 8);
//         state.z = THREE.MathUtils.randFloat(-10, -40);
//         state.scale = THREE.MathUtils.randFloat(0.5, 1.2);

//         // Set initial pos off-screen
//         ufoRef.current.position.set(-60 * state.direction, state.y, state.z);
//         ufoRef.current.scale.setScalar(state.scale);
//         ufoRef.current.visible = true;
//       } else {
//         ufoRef.current.visible = false;
//       }
//     } else {
//       // Move
//       const elapsed = time - state.startTime;
//       const x = -60 * state.direction + (state.speed * elapsed * state.direction);

//       ufoRef.current.position.x = x;
//       ufoRef.current.position.y = state.y + Math.sin(time * 5) * 0.5;
//       ufoRef.current.rotation.z = -0.1 * state.direction;
//       ufoRef.current.rotation.y += 0.1;

//       // Check if out of bounds
//       if ((state.direction === 1 && x > 60) || (state.direction === -1 && x < -60)) {
//         state.active = false;
//       }
//     }
//   });

//   return (
//     <group ref={ufoRef} visible={false}>
//       {/* UFO Disk */}
//       <mesh>
//         <cylinderGeometry args={[0.1, 1, 0.1, 32]} />
//         <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
//       </mesh>
//       {/* Dome */}
//       <mesh position={[0, 0.1, 0]}>
//         <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
//         <meshBasicMaterial color="#00ff00" />
//       </mesh>
//       {/* Engine Light */}
//       <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
//         <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
//         <meshBasicMaterial color="#00ffff" />
//       </mesh>
//       <Sparkles count={20} scale={1.5} size={3} speed={0.4} opacity={0.6} color="#00ff00" />
//     </group>
//   )
// }


// // --- MAIN SCENE COMPONENT ---

// const SceneContent = () => {
//   const scroll = useScroll();
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null);
//   const shipGroup = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     const r1 = scroll.range(0, 0.2); // Orbit
//     const r2 = scroll.range(0.2, 0.2); // Transmisison
//     const r3 = scroll.range(0.4, 0.2); // Work
//     const r4 = scroll.range(0.6, 0.2); // Services
//     const r5 = scroll.range(0.8, 0.2); // Cockpit

//     // Camera Animation State Machine
//     // Base Pos: [0, 0, 5]

//     // Phase 1: Look at Earth/Ship
//     const targetZ = 5 - (scroll.offset * 8); // Move in
//     const targetY = scroll.offset * -2;

//     // Smooth camera movement
//     if (cameraRef.current) {
//       // Linear interpolation for smooth scroll feel
//       cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, 5 - (scroll.offset * 2), 0.1);
//       cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, -(scroll.offset * 2), 0.1);
//     }

//     // Ship Animation: It should fly "down" as we scroll or stay centered while world moves
//     if (shipGroup.current) {
//       // Rotate ship to "dive"
//       shipGroup.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI / 4, r2);

//       // Move ship out of way in later phases or land it
//       const shipZ = THREE.MathUtils.lerp(0, -5, r5);
//       shipGroup.current.position.z = shipZ;
//     }
//   });

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 5]} ref={cameraRef} />

//       {/* Lighting: Cinematic, Volumetric-ish */}
//       <ambientLight intensity={0.2} />
//       <pointLight position={[10, 10, 10]} intensity={1} color="#4ca6ff" />
//       <spotLight
//         position={[-10, 15, 10]}
//         angle={0.3}
//         penumbra={1}
//         intensity={2}
//         castShadow
//         color="#ffffff"
//       />
//       <Environment preset="city" />

//       {/* The Void */}
//       <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

//       <group ref={shipGroup}>
//         <Spaceship />
//       </group>

//       <Earth />

//       {/* Elements placed at specific scroll depths */}
//       <group position={[0, -2, -2]}>
//         <AstronautDog />
//       </group>

//       <group position={[0, -5, 0]}>
//         <FloatingMonoliths />
//       </group>

//       <UFO />
//     </>
//   );
// };

// export const Scene: React.FC = () => {
//   return (
//     <div className="h-screen w-full fixed top-0 left-0 -z-10 bg-black">
//       <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
//         <React.Suspense fallback={null}>
//           <ScrollControls pages={6} damping={0.3}>
//             <SceneContent />
//             <Scroll html style={{ width: '100%', height: '100%' }}>
//               <Overlay />
//             </Scroll>
//           </ScrollControls>
//         </React.Suspense>
//       </Canvas>
//     </div>
//   );
// };