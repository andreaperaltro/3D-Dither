// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Euler } from 'three';

// Using the DitherControls interface from types.d.ts

interface DitherSceneProps {
  imageData?: ImageData;
  controls: DitherControls;
}

// Specify type as any to avoid TypeScript errors with component props
const DitherShapes: React.FC<any> = ({ imageData, controls }) => {
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
            vertexColors={true}
            sizeAttenuation={true}
            transparent={true}
            opacity={controls.pointOpacity}
            size={1}
          />
        </points>
      </group>
    );
  } else if (controls.shapeType === 'cube') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <boxGeometry args={[controls.cubeWidth, controls.cubeHeight, controls.cubeDepth]} />
          <meshStandardMaterial transparent={true} opacity={controls.pointOpacity} />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size}
              rotation={new Euler(controls.shapeRotationX, controls.shapeRotationY, controls.shapeRotationZ)}
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'sphere') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <sphereGeometry args={[controls.sphereRadius, controls.sphereDetail, controls.sphereDetail]} />
          <meshStandardMaterial 
            transparent={true} 
            opacity={controls.pointOpacity} 
          />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size}
              rotation={[controls.shapeRotationX, controls.shapeRotationY, controls.shapeRotationZ]}
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'grid') {
    // Create a wireframe grid where points are connected with lines
    // First we need to organize points into a 2D grid structure
    const { width, height } = imageData;
    const maxDimension = Math.max(width, height);
    const scale = 25 / maxDimension;
    
    // Calculate number of cells in each dimension
    const gridStep = Math.max(1, Math.floor(maxDimension / (controls.gridSize * 2)));
    const gridWidth = Math.ceil(width / gridStep);
    const gridHeight = Math.ceil(height / gridStep);
    
    // Create vertices array mapping 2D positions to 3D space
    const vertices = [];
    const gridPoints = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));
    
    // First pass: create all vertices and store them in a 2D array
    for (let y = 0; y < height; y += gridStep) {
      const gridY = Math.floor(y / gridStep);
      if (gridY >= gridHeight) continue;
      
      for (let x = 0; x < width; x += gridStep) {
        const gridX = Math.floor(x / gridStep);
        if (gridX >= gridWidth) continue;
        
        const i = (y * width + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        
        // Calculate brightness with adjustments
        let brightness = (r + g + b) / 3;
        brightness = (brightness / 255 - 0.5) * controls.contrast + 0.5;
        brightness = Math.max(0, Math.min(1, brightness * controls.brightness));
        
        // Calculate depth from brightness
        const depth = (1 - brightness) * controls.depthScale + controls.depthOffset;
        const depthZ = depth * controls.depthIntensity;
        
        // Store position and depth
        const posX = (x - width / 2) * scale;
        const posY = -(y - height / 2) * scale;
        
        // Store vertex position in our grid array
        gridPoints[gridY][gridX] = {
          position: [posX, posY, depthZ],
          brightness
        };
      }
    }
    
    // Create a collection of line segments
    const allLines = [];
    const colors = [];
    
    // Connect horizontal lines
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth - 1; x++) {
        const point1 = gridPoints[y][x];
        const point2 = gridPoints[y][x + 1];
        
        if (point1 && point2) {
          // Add line segment
          allLines.push({
            points: [
              new THREE.Vector3(...point1.position),
              new THREE.Vector3(...point2.position)
            ],
            color: controls.colorSampling ? 
              new THREE.Color(
                0.7 + point1.brightness * 0.3, 
                0.7 + point1.brightness * 0.3, 
                0.7 + point1.brightness * 0.3
              ) : 
              new THREE.Color(controls.pointColor)
          });
        }
      }
    }
    
    // Connect vertical lines
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight - 1; y++) {
        const point1 = gridPoints[y][x];
        const point2 = gridPoints[y + 1][x];
        
        if (point1 && point2) {
          // Add line segment
          allLines.push({
            points: [
              new THREE.Vector3(...point1.position),
              new THREE.Vector3(...point2.position)
            ],
            color: controls.colorSampling ? 
              new THREE.Color(
                0.7 + point1.brightness * 0.3, 
                0.7 + point1.brightness * 0.3, 
                0.7 + point1.brightness * 0.3
              ) : 
              new THREE.Color(controls.pointColor)
          });
        }
      }
    }
    
    return (
      <group ref={groupRef}>
        {allLines.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            color={line.color}
            lineWidth={controls.strokeWidth}
            opacity={controls.pointOpacity}
            transparent={true}
          />
        ))}
      </group>
    );
  } else if (controls.shapeType === 'line') {
    // Line effect - vertical lines with varying height based on brightness
    return (
      <group ref={groupRef}>
        {pointsData.map((point, i) => (
          <mesh 
            key={i} 
            position={[point.position.x, point.position.y - point.size/4, point.position.z]}
          >
            <boxGeometry args={[0.2, point.size, 0.2]} />
            <meshStandardMaterial 
              color={point.color} 
              transparent={true} 
              opacity={controls.pointOpacity} 
            />
          </mesh>
        ))}
      </group>
    );
  } else if (controls.shapeType === 'triangle') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <coneGeometry args={[controls.triangleRadius, controls.triangleHeight, 3]} />
          <meshStandardMaterial 
            transparent={true} 
            opacity={controls.pointOpacity} 
          />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size}
              rotation={[
                Math.PI/2 + controls.shapeRotationX, 
                controls.shapeRotationY, 
                controls.shapeRotationZ
              ]}
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'torus') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <torusGeometry args={[controls.torusOuterRadius, controls.torusInnerRadius, 8, 16]} />
          <meshStandardMaterial 
            transparent={true} 
            opacity={controls.pointOpacity} 
          />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size}
              rotation={[controls.shapeRotationX, controls.shapeRotationY, controls.shapeRotationZ]}
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'cone') {
    return (
      <group ref={groupRef}>
        <Instances limit={pointsData.length}>
          <coneGeometry args={[controls.coneRadius, controls.coneHeight, 16]} />
          <meshStandardMaterial 
            transparent={true} 
            opacity={controls.pointOpacity} 
          />
          {pointsData.map((point, i) => (
            <Instance 
              key={i} 
              position={[point.position.x, point.position.y, point.position.z]} 
              color={point.color} 
              scale={point.size}
              rotation={[controls.shapeRotationX, controls.shapeRotationY, controls.shapeRotationZ]}
            />
          ))}
        </Instances>
      </group>
    );
  } else if (controls.shapeType === 'topographic') {
    // Create a topographic map effect with contour lines
    const { width, height } = imageData;
    const maxDimension = Math.max(width, height);
    const scale = 25 / maxDimension;
    
    // Calculate grid step based on gridSize
    const gridStep = Math.max(1, Math.floor(maxDimension / (controls.gridSize * 2)));
    const gridWidth = Math.ceil(width / gridStep);
    const gridHeight = Math.ceil(height / gridStep);
    
    // Create a 2D grid of depth values
    const depthGrid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));
    const positionGrid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));
    
    // First pass: create all vertices and store depths in a 2D array
    for (let y = 0; y < height; y += gridStep) {
      const gridY = Math.floor(y / gridStep);
      if (gridY >= gridHeight) continue;
      
      for (let x = 0; x < width; x += gridStep) {
        const gridX = Math.floor(x / gridStep);
        if (gridX >= gridWidth) continue;
        
        const i = (y * width + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        
        // Calculate brightness with adjustments
        let brightness = (r + g + b) / 3;
        brightness = (brightness / 255 - 0.5) * controls.contrast + 0.5;
        brightness = Math.max(0, Math.min(1, brightness * controls.brightness));
        
        // Calculate depth from brightness
        const depth = (1 - brightness) * controls.depthScale + controls.depthOffset;
        const depthZ = depth * controls.depthIntensity;
        
        // Store position and depth
        const posX = (x - width / 2) * scale;
        const posY = -(y - height / 2) * scale;
        
        depthGrid[gridY][gridX] = depthZ;
        positionGrid[gridY][gridX] = [posX, posY, depthZ];
      }
    }
    
    // Create contour lines at fixed intervals
    const minDepth = Math.min(...depthGrid.flat().filter(v => v !== null));
    const maxDepth = Math.max(...depthGrid.flat().filter(v => v !== null));
    const depthRange = maxDepth - minDepth;
    
    // Number of contour levels - now controlled by user
    const numContours = controls.contourLevels;
    const contourInterval = depthRange / numContours;
    
    // Convert hex colors to Three.js colors
    const lowColor = new THREE.Color(controls.topoColorLow);
    const highColor = new THREE.Color(controls.topoColorHigh);
    
    // Collection of contour lines to render
    const contourLines = [];
    
    // For each contour level, create lines representing that depth
    for (let level = 0; level < numContours; level++) {
      const contourDepth = minDepth + level * contourInterval;
      
      // Calculate a color for this contour level based on custom colors
      const t = level / numContours; // Normalized level (0 to 1)
      const color = new THREE.Color().lerpColors(lowColor, highColor, t);
      
      // Process grid cells to find contour crossings
      for (let y = 0; y < gridHeight - 1; y++) {
        for (let x = 0; x < gridWidth - 1; x++) {
          // Get the four corners of this grid cell
          const corners = [
            { pos: positionGrid[y][x], depth: depthGrid[y][x] },
            { pos: positionGrid[y][x + 1], depth: depthGrid[y][x + 1] },
            { pos: positionGrid[y + 1][x + 1], depth: depthGrid[y + 1][x + 1] },
            { pos: positionGrid[y + 1][x], depth: depthGrid[y + 1][x] }
          ];
          
          // Skip if any corner is missing
          if (corners.some(c => !c.pos || c.depth === null)) continue;
          
          // Check each edge of the cell for contour crossings
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0]
          ];
          
          const intersections = [];
          for (const [i, j] of edges) {
            const depthA = corners[i].depth;
            const depthB = corners[j].depth;
            
            // If contour crosses this edge
            if ((depthA <= contourDepth && depthB >= contourDepth) || 
                (depthA >= contourDepth && depthB <= contourDepth)) {
              
              // Calculate interpolation factor
              const t = Math.abs((contourDepth - depthA) / (depthB - depthA)) || 0;
              
              // Linearly interpolate position
              const posA = corners[i].pos;
              const posB = corners[j].pos;
              
              const interpX = posA[0] + t * (posB[0] - posA[0]);
              const interpY = posA[1] + t * (posB[1] - posA[1]);
              
              // Store the intersection point
              intersections.push(new THREE.Vector3(interpX, interpY, contourDepth));
            }
          }
          
          // If we found exactly 2 intersections, we can draw a line
          if (intersections.length === 2) {
            contourLines.push({
              points: [intersections[0], intersections[1]],
              color: color
            });
          }
        }
      }
    }
    
    return (
      <group ref={groupRef}>
        {contourLines.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            color={line.color}
            lineWidth={controls.strokeWidth}
            opacity={controls.pointOpacity}
            transparent={true}
          />
        ))}
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