import React, { useState } from 'react';

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

interface DitherControlsProps {
  controls: DitherControls;
  onChange: (controls: DitherControls) => void;
}

const ControlSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-gray-800 pb-2">
      <button 
        className="flex justify-between items-center w-full py-2 text-sm font-medium text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`space-y-3 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  unit?: string;
}> = ({ label, value, min, max, step, onChange, showValue = true, unit = '' }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-xs text-gray-300">{label}</label>
      {showValue && (
        <span className="text-xs text-gray-400">{value.toFixed(step < 0.1 ? 3 : 1)}{unit}</span>
      )}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 appearance-none bg-gray-700 rounded-full"
    />
  </div>
);

const DitherControls: React.FC<DitherControlsProps> = ({ controls, onChange }) => {
  const handleChange = (key: keyof DitherControls, value: number | boolean | string) => {
    onChange({ ...controls, [key]: value });
  };

  // Determine which shapes use size controls
  const usesSizeControls = ['point', 'cube', 'sphere', 'triangle', 'torus', 'cone'].includes(controls.shapeType);
  
  // 3D model shapes (excluding points and grid/lines)
  const is3DModelShape = ['cube', 'sphere', 'triangle', 'torus', 'cone'].includes(controls.shapeType);
  
  // Shapes that use stroke width
  const usesStrokeWidth = ['grid', 'topographic'].includes(controls.shapeType);

  return (
    <div className="space-y-2 text-gray-200">
      <ControlSection title="Shape & Grid">
        <div className="space-y-1 mb-3">
          <label className="text-xs text-gray-300">Shape Type</label>
          <select 
            value={controls.shapeType}
            onChange={(e) => handleChange("shapeType", e.target.value)}
            className="w-full p-1 text-xs bg-gray-800 border border-gray-700 rounded"
          >
            <option value="point">Points</option>
            <option value="cube">Cubes</option>
            <option value="sphere">Spheres</option>
            <option value="grid">Grid</option>
            <option value="line">Lines</option>
            <option value="triangle">Triangles</option>
            <option value="torus">Rings</option>
            <option value="cone">Cones</option>
            <option value="topographic">Topographic</option>
          </select>
        </div>
        
        <Slider 
          label="Grid Size" 
          value={controls.gridSize} 
          min={10} 
          max={100} 
          step={1} 
          onChange={(v) => handleChange("gridSize", v)}
        />
      </ControlSection>

      {usesSizeControls && (
        <ControlSection title="Size & Opacity">
          <Slider 
            label="Min Size" 
            value={controls.minDotSize} 
            min={0.01} 
            max={0.5} 
            step={0.01} 
            onChange={(v) => handleChange("minDotSize", v)}
          />
          
          <Slider 
            label="Max Size" 
            value={controls.maxDotSize} 
            min={0.1} 
            max={5} 
            step={0.1} 
            onChange={(v) => handleChange("maxDotSize", v)}
          />
          
          <Slider 
            label="Opacity" 
            value={controls.pointOpacity} 
            min={0} 
            max={1} 
            step={0.1} 
            onChange={(v) => handleChange("pointOpacity", v)}
          />
        </ControlSection>
      )}

      {is3DModelShape && (
        <ControlSection title="Shape Rotation">
          <Slider 
            label="Rotation X" 
            value={controls.shapeRotationX} 
            min={0} 
            max={Math.PI * 2} 
            step={0.1} 
            onChange={(v) => handleChange("shapeRotationX", v)}
          />
          
          <Slider 
            label="Rotation Y" 
            value={controls.shapeRotationY} 
            min={0} 
            max={Math.PI * 2} 
            step={0.1} 
            onChange={(v) => handleChange("shapeRotationY", v)}
          />
          
          <Slider 
            label="Rotation Z" 
            value={controls.shapeRotationZ} 
            min={0} 
            max={Math.PI * 2} 
            step={0.1} 
            onChange={(v) => handleChange("shapeRotationZ", v)}
          />
        </ControlSection>
      )}

      {/* Cube specific controls */}
      {controls.shapeType === 'cube' && (
        <ControlSection title="Cube Dimensions">
          <Slider 
            label="Width" 
            value={controls.cubeWidth} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(v) => handleChange("cubeWidth", v)}
          />
          
          <Slider 
            label="Height" 
            value={controls.cubeHeight} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(v) => handleChange("cubeHeight", v)}
          />
          
          <Slider 
            label="Depth" 
            value={controls.cubeDepth} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(v) => handleChange("cubeDepth", v)}
          />
        </ControlSection>
      )}

      {/* Sphere specific controls */}
      {controls.shapeType === 'sphere' && (
        <ControlSection title="Sphere Parameters">
          <Slider 
            label="Radius" 
            value={controls.sphereRadius} 
            min={0.1} 
            max={1} 
            step={0.1} 
            onChange={(v) => handleChange("sphereRadius", v)}
          />
          
          <Slider 
            label="Detail" 
            value={controls.sphereDetail} 
            min={4} 
            max={16} 
            step={1} 
            onChange={(v) => handleChange("sphereDetail", v)}
          />
        </ControlSection>
      )}

      {/* Triangle specific controls */}
      {controls.shapeType === 'triangle' && (
        <ControlSection title="Triangle Parameters">
          <Slider 
            label="Radius" 
            value={controls.triangleRadius} 
            min={0.1} 
            max={1} 
            step={0.1} 
            onChange={(v) => handleChange("triangleRadius", v)}
          />
          
          <Slider 
            label="Height" 
            value={controls.triangleHeight} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(v) => handleChange("triangleHeight", v)}
          />
        </ControlSection>
      )}

      {/* Torus specific controls */}
      {controls.shapeType === 'torus' && (
        <ControlSection title="Ring Parameters">
          <Slider 
            label="Outer Radius" 
            value={controls.torusOuterRadius} 
            min={0.1} 
            max={1} 
            step={0.1} 
            onChange={(v) => handleChange("torusOuterRadius", v)}
          />
          
          <Slider 
            label="Inner Radius" 
            value={controls.torusInnerRadius} 
            min={0.05} 
            max={0.5} 
            step={0.05} 
            onChange={(v) => handleChange("torusInnerRadius", v)}
          />
        </ControlSection>
      )}

      {/* Cone specific controls */}
      {controls.shapeType === 'cone' && (
        <ControlSection title="Cone Parameters">
          <Slider 
            label="Radius" 
            value={controls.coneRadius} 
            min={0.1} 
            max={1} 
            step={0.1} 
            onChange={(v) => handleChange("coneRadius", v)}
          />
          
          <Slider 
            label="Height" 
            value={controls.coneHeight} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(v) => handleChange("coneHeight", v)}
          />
        </ControlSection>
      )}

      {/* Topographic specific controls */}
      {controls.shapeType === 'topographic' && (
        <ControlSection title="Topographic Parameters">
          <Slider 
            label="Contour Levels" 
            value={controls.contourLevels} 
            min={5} 
            max={50} 
            step={1} 
            onChange={(v) => handleChange("contourLevels", v)}
          />
          
          <div className="space-y-1">
            <label className="text-xs text-gray-300">Low Elevation Color</label>
            <input
              type="color"
              value={controls.topoColorLow}
              onChange={(e) => handleChange("topoColorLow", e.target.value)}
              className="w-full h-6 rounded"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-300">High Elevation Color</label>
            <input
              type="color"
              value={controls.topoColorHigh}
              onChange={(e) => handleChange("topoColorHigh", e.target.value)}
              className="w-full h-6 rounded"
            />
          </div>
        </ControlSection>
      )}

      {usesStrokeWidth && (
        <ControlSection title="Line Settings">
          <Slider 
            label="Stroke Width" 
            value={controls.strokeWidth} 
            min={0.1} 
            max={5} 
            step={0.1} 
            onChange={(v) => handleChange("strokeWidth", v)}
          />
        </ControlSection>
      )}

      <ControlSection title="Depth & Density">
        <Slider 
          label="Depth Intensity" 
          value={controls.depthIntensity} 
          min={0} 
          max={5} 
          step={0.1} 
          onChange={(v) => handleChange("depthIntensity", v)}
        />
        
        <Slider 
          label="Depth Offset" 
          value={controls.depthOffset} 
          min={-2} 
          max={2} 
          step={0.1} 
          onChange={(v) => handleChange("depthOffset", v)}
        />
        
        <Slider 
          label="Depth Scale" 
          value={controls.depthScale} 
          min={0} 
          max={3} 
          step={0.1} 
          onChange={(v) => handleChange("depthScale", v)}
        />
      </ControlSection>

      <ControlSection title="Color & Brightness">
        <Slider 
          label="Brightness" 
          value={controls.brightness} 
          min={0} 
          max={2} 
          step={0.1} 
          onChange={(v) => handleChange("brightness", v)}
        />
        
        <Slider 
          label="Contrast" 
          value={controls.contrast} 
          min={0} 
          max={2} 
          step={0.1} 
          onChange={(v) => handleChange("contrast", v)}
        />
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-300">Color Sampling</label>
            <input
              type="checkbox"
              checked={controls.colorSampling}
              onChange={(e) => handleChange("colorSampling", e.target.checked)}
              className="h-3 w-3"
            />
          </div>
        </div>
        
        {!controls.colorSampling && (
          <div className="space-y-1">
            <label className="text-xs text-gray-300">Point Color</label>
            <input
              type="color"
              value={controls.pointColor}
              onChange={(e) => handleChange("pointColor", e.target.value)}
              className="w-full h-6 rounded"
            />
          </div>
        )}
      </ControlSection>

      <ControlSection title="Animation">
        <Slider 
          label="Rotation Speed" 
          value={controls.rotationSpeed} 
          min={0} 
          max={0.05} 
          step={0.001} 
          onChange={(v) => handleChange("rotationSpeed", v)}
        />
      </ControlSection>
    </div>
  );
};

export default DitherControls; 