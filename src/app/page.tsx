'use client';

import React, { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import DitherScene from "@/components/DitherScene";
import DitherControls from "@/components/DitherControls";

export default function Home() {
  const [imageData, setImageData] = useState<ImageData>();
  const [imageName, setImageName] = useState<string>("");
  const [controls, setControls] = useState({
    gridSize: 50,
    minDotSize: 0.2,
    maxDotSize: 3,
    brightness: 1,
    contrast: 1,
    depthIntensity: 1,
    depthOffset: 0,
    depthScale: 1,
    pointOpacity: 0.8,
    threshold: 0,
    rotationSpeed: 0.005,
    pointColor: "#ffffff",
    colorSampling: true,
    shapeType: 'point' as 'point' | 'cube' | 'sphere',
  });

  return (
    <main className="flex min-h-screen">
      <div className="sticky top-0 h-screen w-1/2">
        <DitherScene imageData={imageData} controls={controls} />
      </div>
      <div className="w-1/2 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-4">3D Dither</h1>
            <ImageUploader
              onImageChange={setImageData}
              onImageNameChange={setImageName}
            />
            {imageName && (
              <p className="mt-2 text-sm text-gray-400">
                Current image: {imageName}
              </p>
            )}
          </div>
          <DitherControls controls={controls} onChange={setControls} />
        </div>
      </div>
    </main>
  );
} 