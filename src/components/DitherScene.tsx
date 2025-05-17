import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

interface DitherControls {
  gridSize: number;
  minDotSize: number;
  maxDotSize: number;
  brightness: number;
  contrast: number;
  depthIntensity: number;
  depthOffset: number;
  depthScale: number;
  pointOpacity: number;
  threshold: number;
  rotationSpeed: number;
  pointColor: string;
  colorSampling: boolean;
  shapeType: 'point' | 'cube' | 'sphere';
}

interface DitherSceneProps {
  imageData?: ImageData;
  controls: DitherControls;
}

const DitherShapes = ({ imageData, controls }) => {
  const groupRef = useRef(null);
  const [pointsData, setPointsData] = useState([]);

  useEffect(() => {
    if (!imageData) return;

    const { width, height, data } = imageData;
    const newPointsData = [];

    // Calculate the maximum dimension for proper scaling
    const maxDimension = Math.max(width, height);
    const scale = 25 / maxDimension;

    // Calculate grid step based on gridSize
    const gridStep = Math.max(1, Math.floor(maxDimension / (controls.gridSize * 2)));

    for (let y = 0; y < height; y += gridStep) {
      for (let x = 0; x < width; x += gridStep) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Apply brightness and contrast adjustments
        let brightness = (r + g + b) / 3;
        brightness = (brightness / 255 - 0.5) * controls.contrast + 0.5;
        brightness = Math.max(0, Math.min(1, brightness * controls.brightness));

        if (brightness > controls.threshold / 255) {
          // Calculate depth with offset and scale
          const depth = (1 - brightness) * controls.depthScale + controls.depthOffset;
          
          // Calculate point size based on brightness
          const normalizedBrightness = brightness;
          const pointSize = controls.minDotSize + 
            (controls.maxDotSize - controls.minDotSize) * normalizedBrightness;

          const position = new THREE.Vector3(
            (x - width / 2) * scale,
            -(y - height / 2) * scale,
            depth * controls.depthIntensity
          );
          
          let color;
          if (controls.colorSampling) {
            // Apply brightness and contrast to colors
            color = new THREE.Color(
              Math.max(0, Math.min(1, (r / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness,
              Math.max(0, Math.min(1, (g / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness,
              Math.max(0, Math.min(1, (b / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness
            );
            color.multiplyScalar(1.3); // Make colors more vibrant
          } else {
            color = new THREE.Color(controls.pointColor);
          }

          newPointsData.push({
            position,
            color,
            size: pointSize
          });
        }
      }
    }

    setPointsData(newPointsData);
  }, [imageData, controls]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += controls.rotationSpeed;
    }
  });

  if (!imageData || pointsData.length === 0) {
    return null;
  }

  // Render different shape types
  if (controls.shapeType === 'point') {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsData.length * 3);
    const colors = new Float32Array(pointsData.length * 3);
    const sizes = new Float32Array(pointsData.length);
    
    pointsData.forEach((point, i) => {
      positions[i * 3] = point.position.x;
      positions[i * 3 + 1] = point.position.y;
      positions[i * 3 + 2] = point.position.z;
      
      colors[i * 3] = point.color.r;
      colors[i * 3 + 1] = point.color.g;
      colors[i * 3 + 2] = point.color.b;
      
      sizes[i] = point.size;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return (
      <group ref={groupRef}>
        <points>
          <primitive object={geometry} />
          <pointsMaterial
            size={1}
            vertexColors
            sizeAttenuation
            transparent
            opacity={controls.pointOpacity}
          />
        </points>
      </group>
    );
  } else if (controls.shapeType === 'cube') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial transparent opacity={controls.pointOpacity} />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size} 
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'sphere') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial transparent opacity={controls.pointOpacity} />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size} 
            />
          ))}
        </Instances>
      </group>
    );
  }
  
  return null;
};

const DitherScene: React.FC<DitherSceneProps> = ({ imageData, controls }) => {
  return (
    <div className="h-full">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 45 }}
        style={{ background: '#000000' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <DitherShapes imageData={imageData} controls={controls} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          zoomSpeed={2}
          rotateSpeed={0.5}
          panSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default DitherScene; 