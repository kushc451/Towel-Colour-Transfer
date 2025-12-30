import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  label: string;
  subLabel?: string;
  image: UploadedImage | null;
  onImageChange: (image: UploadedImage | null) => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, subLabel, image, onImageChange, id }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const previewUrl = URL.createObjectURL(file);
      
      // Create an image element to get dimensions
      const img = new Image();
      img.onload = () => {
        onImageChange({
          file,
          previewUrl,
          base64,
          mimeType: file.type,
          width: img.width,
          height: img.height,
        });
      };
      img.src = previewUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {subLabel && <p className="text-xs text-slate-500 mb-2">{subLabel}</p>}
      
      <div 
        onClick={triggerUpload}
        className={`
          relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${image ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
          id={id}
        />
        
        {image ? (
          <div className="relative w-full h-full p-2 group">
            <img 
              src={image.previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            <button 
              onClick={handleRemove}
              className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
              <Upload className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Click to upload</p>
            <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
