// @ts-nocheck
'use client';

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import DitherScene from "@/components/DitherScene";
import DitherControls from "@/components/DitherControls";

export default function Home() {
  const [imageData, setImageData] = useState<ImageData>();
  const [imageName, setImageName] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [controls, setControls] = useState({
    gridSize: 50,
    minDotSize: 0.05,
    maxDotSize: 1.5,
    brightness: 1,
    contrast: 1,
    depthIntensity: 1,
    depthOffset: 0,
    depthScale: 1,
    pointOpacity: 0.8,
    threshold: 0,
    rotationSpeed: 0,
    pointColor: "#ffffff",
    colorSampling: true,
    contourLevels: 15,
    strokeWidth: 1,
    topoColorLow: "#0000ff",
    topoColorHigh: "#ff0000",
    shapeRotationX: 0,
    shapeRotationY: 0,
    shapeRotationZ: 0,
    torusOuterRadius: 0.3,
    torusInnerRadius: 0.1,
    coneRadius: 0.3,
    coneHeight: 1,
    cubeWidth: 1,
    cubeHeight: 1,
    cubeDepth: 1,
    sphereRadius: 0.5,
    sphereDetail: 8,
    triangleRadius: 0.5,
    triangleHeight: 1,
    shapeType: 'point' as 'point' | 'cube' | 'sphere' | 'grid' | 'line' | 'triangle' | 'torus' | 'cone' | 'topographic',
  });

  return (
    <main className="flex min-h-screen relative bg-black">
      <div className="w-full h-screen">
        <DitherScene imageData={imageData} controls={controls} />
      </div>
      
      <div className={`fixed top-0 right-0 h-screen transition-all duration-300 bg-black/80 backdrop-blur-sm ${isPanelOpen ? 'w-80' : 'w-12'} overflow-hidden`}>
        <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute top-4 left-4 z-10 p-1 bg-gray-800 rounded-full"
        >
          {isPanelOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className={`h-full overflow-y-auto p-6 pt-16 ${isPanelOpen ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-xl font-bold mb-6 text-white">3D Dither</h1>
          
          <div className="mb-6">
            <ImageUploader
              onImageChange={setImageData}
              onImageNameChange={setImageName}
            />
            {imageName && (
              <p className="mt-2 text-xs text-gray-400">
                Current: {imageName}
              </p>
            )}
          </div>
          
          <DitherControls controls={controls} onChange={setControls} />
        </div>
      </div>
    </main>
  );
} 