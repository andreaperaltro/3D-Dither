# Changelog

All notable changes to the 3D Dither project will be documented in this file.

## [0.2.0] - 2024-08-25

### Added
- New shape types for visualization:
  - Grid (wireframe) mode
  - Line mode
  - Triangle shape
  - Torus (ring) shape
  - Cone shape
  - Topographic (contour lines) mode
- Shape-specific controls that conditionally appear based on selected shape
- 3D rotation controls (X, Y, Z) for all 3D models
- Stroke width controls for grid and topographic visualizations
- Color gradient system for topographic visualization
  - User can select low and high elevation colors
  - Colors are interpolated between these values
- Contour levels control for topographic visualization

### Changed
- Improved UI with collapsible sidebar
- Enhanced contrast and visibility of 3D render
- Optimized default dot sizes to prevent excessive overlap
- Fixed line width rendering issues by implementing @react-three/drei's Line component
- Adjusted topographic rendering to prevent app crashes

## [0.1.0] - 2024-08-20

### Added
- Initial release with core functionality
- Image upload capability
- 3D dither visualization with Three.js
- Basic shape options (points, cubes, spheres)
- Controls for:
  - Grid size
  - Dot size min/max
  - Brightness/contrast
  - Depth mapping
  - Point opacity
  - Rotation speed
  - Color options
- Responsive UI with Tailwind CSS 