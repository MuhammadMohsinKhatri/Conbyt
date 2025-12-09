import React, { useMemo, useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { FaExclamationTriangle } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const quillRef = useRef(null);
  const [missingAltTextCount, setMissingAltTextCount] = useState(0);

  // Check for images without alt text
  useEffect(() => {
    if (value) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      const images = doc.querySelectorAll('img');
      let missingCount = 0;
      
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim() === '' || alt === 'Image') {
          missingCount++;
        }
      });
      
      setMissingAltTextCount(missingCount);
    } else {
      setMissingAltTextCount(0);
    }
  }, [value]);

  // Custom toolbar with all required features
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        link: function(value) {
          if (value) {
            const href = prompt('Enter the URL:');
            if (href) {
              this.quill.format('link', href);
            }
          } else {
            this.quill.format('link', false);
          }
        },
        image: function() {
          const url = prompt('Enter image URL:');
          if (url) {
            const altText = prompt('Enter alt text for accessibility (required):');
            if (altText === null) return; // User cancelled
            
            const quill = this.quill;
            const range = quill.getSelection(true);
            
            // Create proper HTML img tag with alt text
            const imgHtml = `<img src="${url}" alt="${altText || 'Image'}" style="max-width: 100%; height: auto;" />`;
            
            // Insert the HTML
            quill.clipboard.dangerouslyPasteHTML(range.index, imgHtml);
            
            // Move cursor after the image
            quill.setSelection(range.index + 1);
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  // Custom styles for dark theme
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-toolbar.ql-snow {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(35, 35, 43, 0.8);
        border-radius: 8px 8px 0 0;
      }
      .ql-container.ql-snow {
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-top: none;
        border-radius: 0 0 8px 8px;
        background: rgba(18, 18, 23, 0.8);
        color: white;
        font-size: 16px;
      }
      .ql-editor {
        min-height: 300px;
        color: white;
      }
      .ql-editor.ql-blank::before {
        color: rgba(255, 255, 255, 0.5);
        font-style: normal;
      }
      .ql-snow .ql-stroke {
        stroke: rgba(255, 255, 255, 0.8);
      }
      .ql-snow .ql-fill {
        fill: rgba(255, 255, 255, 0.8);
      }
      .ql-snow .ql-picker-label {
        color: rgba(255, 255, 255, 0.8);
      }
      .ql-snow .ql-picker-options {
        background: rgba(35, 35, 43, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .ql-snow .ql-picker-item {
        color: rgba(255, 255, 255, 0.8);
      }
      .ql-snow .ql-picker-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .ql-snow .ql-picker-item.ql-selected {
        background: rgba(124, 58, 237, 0.3);
        color: #7c3aed;
      }
      .ql-snow a {
        color: #7c3aed;
        text-decoration: underline;
      }
      .ql-snow .ql-tooltip {
        background: rgba(35, 35, 43, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
      }
      .ql-snow .ql-tooltip input {
        background: rgba(18, 18, 23, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = (content, delta, source, editor) => {
    onChange(content);
  };

  return (
    <div className="rich-text-editor-wrapper">
      {missingAltTextCount > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-3 flex items-start gap-2">
          <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-300 text-sm font-medium">
              {missingAltTextCount} image{missingAltTextCount > 1 ? 's' : ''} missing alt text
            </p>
            <p className="text-yellow-200/80 text-xs mt-1">
              Please add alt text to all images for accessibility. Click on images in the editor to edit them.
            </p>
          </div>
        </div>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;

