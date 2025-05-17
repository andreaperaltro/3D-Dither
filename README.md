# 3D Dither

A creative web application that transforms your images into interactive 3D visualizations using a dithering effect. Built with Next.js, Three.js, and React Three Fiber.

## Features

- Upload any image and see it transformed into a 3D point cloud
- Choose from multiple shape types:
  - Points (classic dither effect)
  - Cubes, Spheres, Triangles
  - Rings (torus)
  - Cones
  - Grid (wireframe)
  - Lines
  - Topographic contour lines
- Extensive controls for customization:
  - Grid density
  - Size and opacity
  - Brightness and contrast
  - Depth mapping
  - Color sampling or solid colors
  - 3D rotation controls
  - Shape-specific parameters
  - Contour levels for topographic mode
  - Line stroke width controls

## Performance Optimizations

This app includes advanced WebGL optimizations to handle large point clouds smoothly:

- Dynamic Level of Detail (LOD) system that adapts quality based on distance
- Frustum culling to only render visible objects
- Adaptive point limits based on device capability
- Optimized shader material for points with circular fragment rendering
- Instance batching and memory pool for 3D objects
- Reduced render resolution on low-end devices
- Selective matrix updates for better animation performance
- Press Shift+P to toggle performance monitoring stats

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

The application processes your uploaded image pixel by pixel, extracting brightness values to determine:
1. Which points to render (based on threshold)
2. How large each point should be (based on brightness)
3. The depth (z-position) of each point (creating a 3D effect)
4. The color of each point (either sampled from the original image or a solid color)

The 3D scene can be manipulated with mouse controls:
- Left-click and drag to rotate
- Right-click and drag to pan
- Scroll to zoom

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Three.js](https://threejs.org/) - 3D library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
