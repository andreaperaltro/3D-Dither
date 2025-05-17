import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
}

interface DitherSceneProps {
  imageData?: ImageData;
  controls: DitherControls;
}

const DitherPoints: React.FC<{ 
  imageData?: ImageData;
  controls: DitherControls;
}> = ({ imageData, controls }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [colors, setColors] = useState<THREE.Color[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);

  useEffect(() => {
    if (!imageData) return;

    const { width, height, data } = imageData;
    const newPoints: THREE.Vector3[] = [];
    const newColors: THREE.Color[] = [];
    const newSizes: number[] = [];

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

          newPoints.push(
            new THREE.Vector3(
              (x - width / 2) * scale,
              -(y - height / 2) * scale,
              depth * controls.depthIntensity
            )
          );
          
          if (controls.colorSampling) {
            // Apply brightness and contrast to colors
            const color = new THREE.Color(
              Math.max(0, Math.min(1, (r / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness,
              Math.max(0, Math.min(1, (g / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness,
              Math.max(0, Math.min(1, (b / 255 - 0.5) * controls.contrast + 0.5)) * controls.brightness
            );
            color.multiplyScalar(1.3); // Make colors more vibrant
            newColors.push(color);
          } else {
            newColors.push(new THREE.Color(controls.pointColor));
          }

          newSizes.push(pointSize);
        }
      }
    }

    setPoints(newPoints);
    setColors(newColors);
    setSizes(newSizes);
  }, [imageData, controls]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += controls.rotationSpeed;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (points.length > 0) {
      const positions = new Float32Array(points.length * 3);
      const colorArray = new Float32Array(points.length * 3);
      const sizeArray = new Float32Array(points.length);
      
      points.forEach((point, i) => {
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        
        const color = colors[i];
        colorArray[i * 3] = color.r;
        colorArray[i * 3 + 1] = color.g;
        colorArray[i * 3 + 2] = color.b;

        sizeArray[i] = sizes[i];
      });
      
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    }
    return geo;
  }, [points, colors, sizes]);

  if (!imageData || points.length === 0) {
    return null;
  }

  return (
    <points ref={pointsRef}>
      <primitive object={geometry} />
      <pointsMaterial
        size={1}
        vertexColors={controls.colorSampling}
        sizeAttenuation={true}
        transparent
        opacity={controls.pointOpacity}
      />
    </points>
  );
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
        <DitherPoints imageData={imageData} controls={controls} />
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