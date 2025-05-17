import React from 'react';

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

interface DitherControlsProps {
  controls: DitherControls;
  onChange: (controls: DitherControls) => void;
}

const DitherControls: React.FC<DitherControlsProps> = ({ controls, onChange }) => {
  const handleChange = (key: keyof DitherControls, value: number | boolean | string) => {
    onChange({ ...controls, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Grid & Points</h2>
        <div className="space-y-2">
          <label className="block text-sm">
            Grid Size
            <span className="text-xs text-gray-400 ml-2">({controls.gridSize * 2}x{controls.gridSize * 2})</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={controls.gridSize}
            onChange={(e) => handleChange("gridSize", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Min Dot Size</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={controls.minDotSize}
            onChange={(e) => handleChange("minDotSize", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.minDotSize.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Max Dot Size</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={controls.maxDotSize}
            onChange={(e) => handleChange("maxDotSize", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.maxDotSize.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Point Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={controls.pointOpacity}
            onChange={(e) => handleChange("pointOpacity", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.pointOpacity.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Depth & Brightness</h2>
        <div className="space-y-2">
          <label className="block text-sm">Depth Intensity</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={controls.depthIntensity}
            onChange={(e) => handleChange("depthIntensity", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.depthIntensity.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Depth Offset</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={controls.depthOffset}
            onChange={(e) => handleChange("depthOffset", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.depthOffset.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Depth Scale</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={controls.depthScale}
            onChange={(e) => handleChange("depthScale", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.depthScale.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Brightness</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={controls.brightness}
            onChange={(e) => handleChange("brightness", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.brightness.toFixed(1)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Contrast</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={controls.contrast}
            onChange={(e) => handleChange("contrast", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.contrast.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Animation & Color</h2>
        <div className="space-y-2">
          <label className="block text-sm">Rotation Speed</label>
          <input
            type="range"
            min="0"
            max="0.02"
            step="0.001"
            value={controls.rotationSpeed}
            onChange={(e) => handleChange("rotationSpeed", parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{controls.rotationSpeed.toFixed(3)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Point Color</label>
          <input
            type="color"
            value={controls.pointColor}
            onChange={(e) => handleChange("pointColor", e.target.value)}
            className="w-full h-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="colorSampling"
            checked={controls.colorSampling}
            onChange={(e) => handleChange("colorSampling", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="colorSampling" className="text-sm">
            Use Image Colors
          </label>
        </div>
      </div>
    </div>
  );
};

export default DitherControls; 