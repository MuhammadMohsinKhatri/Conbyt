import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaTimes, FaImage, FaExclamationTriangle } from 'react-icons/fa';

const ImageUpload = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "Click to upload or paste image URL", 
  accept = "image/*", 
  uploadEndpoint = "/api/upload/image",
  altText: externalAltText,
  onAltTextChange
}) => {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [preview, setPreview] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [altText, setAltText] = useState(externalAltText || '');
  const [showAltWarning, setShowAltWarning] = useState(false);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  // Sync with value prop changes (e.g., when editing)
  useEffect(() => {
    if (value !== undefined) {
      setImageUrl(value || '');
      // Resolve preview for relative paths
      try {
        if (value && (value.startsWith('/') || value.startsWith('./'))) {
          setPreview(`${window.location.origin}${value.startsWith('./') ? value.slice(1) : value}`);
        } else {
          setPreview(value || '');
        }
      } catch (err) {
        setPreview(value || '');
      }
      // Check if image exists but alt text is missing
      if (value && !altText) {
        setShowAltWarning(true);
      } else {
        setShowAltWarning(false);
      }
    }
  }, [value, altText]);

  // Sync with external alt text prop
  useEffect(() => {
    if (externalAltText !== undefined) {
      setAltText(externalAltText || '');
    }
  }, [externalAltText]);

  // Check alt text when it changes
  useEffect(() => {
    if (imageUrl && !altText.trim()) {
      setShowAltWarning(true);
    } else {
      setShowAltWarning(false);
    }
  }, [imageUrl, altText]);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create preview using FileReader for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('cms_token');
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.imageUrl) {
        throw new Error('Server did not return image URL');
      }
      
      // Set the server file path as the image URL
      console.log('Image uploaded successfully:', result.imageUrl);
      setImageUrl(result.imageUrl);
      // Resolve preview to absolute URL for display
      try {
        const resolved = result.imageUrl && (result.imageUrl.startsWith('/') ? `${window.location.origin}${result.imageUrl}` : result.imageUrl);
        setPreview(resolved);
      } catch (err) {
        setPreview(result.imageUrl);
      }
      onChange(result.imageUrl);
      setIsUploading(false);
      
      // Show warning if alt text is missing
      if (!altText.trim()) {
        setShowAltWarning(true);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error.message || 'Error uploading image. Please try again.';
      alert(errorMessage);
      setPreview('');
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
    // Resolve preview if relative
    try {
      if (url && (url.startsWith('/') || url.startsWith('./'))) {
        setPreview(`${window.location.origin}${url.startsWith('./') ? url.slice(1) : url}`);
      } else {
        setPreview(url);
      }
    } catch (err) {
      setPreview(url);
    }
    onChange(url);
    // Show warning if alt text is missing
    if (url && !altText.trim()) {
      setShowAltWarning(true);
    }
  };

  const handleAltTextChange = (text) => {
    setAltText(text);
    if (onAltTextChange) {
      onAltTextChange(text);
    }
    // Hide warning if alt text is provided
    if (text.trim()) {
      setShowAltWarning(false);
    }
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
      
      {/* Alt Text Warning */}
      {showAltWarning && preview && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-3 flex items-start gap-2">
          <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-300 text-sm font-medium">Alt text missing</p>
            <p className="text-yellow-200/80 text-xs mt-1">
              This image needs alt text for accessibility. Please add a description below.
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-secondary/50 mb-3">
          <img
            src={(() => {
              try {
                if (preview && (preview.startsWith('/') || preview.startsWith('./'))) {
                  return `${window.location.origin}${preview.startsWith('./') ? preview.slice(1) : preview}`;
                }
              } catch (err) {}
              return preview;
            })()}
            alt={altText || "Preview"}
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
      <div className="relative mb-3">
        <input
          ref={urlInputRef}
          type="text"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
        />
        <p className="text-white/50 text-xs mt-1">Or enter image URL or file path</p>
      </div>

      {/* Alt Text Input */}
      {preview && (
        <div className="relative">
          <label className="block text-white mb-2 font-medium text-sm">
            Alt Text (Accessibility) {!altText.trim() && <span className="text-yellow-400">*</span>}
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => handleAltTextChange(e.target.value)}
            placeholder="Describe the image for screen readers (e.g., 'A person typing on a laptop')"
            className={`w-full px-4 py-3 bg-primary/80 border rounded-lg text-white placeholder-white/50 focus:outline-none ${
              showAltWarning 
                ? 'border-yellow-500/50 focus:border-yellow-500' 
                : 'border-white/20 focus:border-accent'
            }`}
          />
          <p className="text-white/50 text-xs mt-1">
            {altText.trim() 
              ? `${altText.length} characters - Good for accessibility` 
              : 'Required for accessibility and SEO'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

