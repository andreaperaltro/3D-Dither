// Type definitions for the 3D Dither app

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

// Additional declarations for any missing or custom types
declare module 'three';
declare module '@react-three/fiber';
declare module '@react-three/drei'; 