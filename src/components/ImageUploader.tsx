// @ts-nocheck
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageChange: (imageData: ImageData) => void;
  onImageNameChange: (name: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, onImageNameChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageNameChange(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            onImageChange(imageData);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange, onImageNameChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className="border border-gray-700 rounded-md p-4 text-center cursor-pointer hover:border-gray-500 transition-colors"
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-xs text-gray-400">
          {isDragActive ? "Drop image..." : "Upload image"}
        </p>
      </div>
    </div>
  );
};

export default ImageUploader; 