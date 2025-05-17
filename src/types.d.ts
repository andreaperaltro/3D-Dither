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
  contourLevels: number;
  // Stroke width for grid and topographic
  strokeWidth: number;
  // Topographic colors
  topoColorLow: string; 
  topoColorHigh: string;
  // Shape rotation controls
  shapeRotationX: number;
  shapeRotationY: number;
  shapeRotationZ: number;
  // Shape-specific parameters
  torusOuterRadius: number;
  torusInnerRadius: number;
  coneRadius: number;
  coneHeight: number;
  cubeWidth: number;
  cubeHeight: number;
  cubeDepth: number;
  sphereRadius: number;
  sphereDetail: number;
  triangleRadius: number;
  triangleHeight: number;
  shapeType: 'point' | 'cube' | 'sphere' | 'grid' | 'line' | 'triangle' | 'torus' | 'cone' | 'topographic';
}

// Additional declarations for any missing or custom types
declare module 'three';
declare module '@react-three/fiber';
declare module '@react-three/drei'; 