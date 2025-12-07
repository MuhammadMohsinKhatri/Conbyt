import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaImage } from 'react-icons/fa';

const ImageUpload = ({ value, onChange, label, placeholder = "Click to upload or paste image URL", accept = "image/*" }) => {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [preview, setPreview] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        setImageUrl(base64String);
        onChange(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setPreview(url);
    onChange(url);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          handleFileSelect(file);
          break;
        }
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (urlInputRef.current) {
      urlInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-white mb-2 font-medium">{label}</label>
      )}
      
      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-secondary/50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          dragActive
            ? 'border-accent bg-accent/10'
            : 'border-white/20 hover:border-white/40 bg-secondary/30'
        } ${preview ? 'hidden' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="text-center">
          <FaImage className="mx-auto text-4xl text-white/50 mb-3" />
          <p className="text-white/70 mb-2">
            {isUploading ? 'Uploading...' : 'Drag & drop image here, or click to select'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg text-white transition disabled:opacity-50"
          >
            <FaUpload /> Choose File
          </button>
          <p className="text-white/50 text-xs mt-2">or paste from clipboard</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="relative">
        <input
          ref={urlInputRef}
          type="url"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
        />
        <p className="text-white/50 text-xs mt-1">Or enter image URL</p>
      </div>
    </div>
  );
};

export default ImageUpload;

