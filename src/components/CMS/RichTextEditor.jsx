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
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        // Only count images that are actually uploaded (have src) and missing alt text
        if (src && src.trim() !== '' && (!alt || alt.trim() === '' || alt === 'Image' || alt.toLowerCase() === 'image')) {
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
        // Enhanced size selector
        [{ 'size': [
          'small', false, 'large', 'huge', 
          '12px','14px','16px','18px','20px','24px','28px','32px','40px'] }],
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
      // Allow pasting HTML content with proper formatting
      preserveWhitespace: true
    }
  }), []);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image',
    'blockquote', 'code-block',
    'script', 'indent', 'direction'
  ];

  // Custom styles for dark theme with enhanced color pickers
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
      /* Enhanced Color Picker Styles - Word-like */
      .ql-snow .ql-picker.ql-color,
      .ql-snow .ql-picker.ql-background {
        width: 42px;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-label,
      .ql-snow .ql-picker.ql-background .ql-picker-label {
        width: 28px;
        height: 24px;
        padding: 2px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        background: #000;
        position: relative;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-label svg,
      .ql-snow .ql-picker.ql-background .ql-picker-label svg {
        display: none;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-label::after,
      .ql-snow .ql-picker.ql-background .ql-picker-label::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 2px;
        background: currentColor;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-label::before,
      .ql-snow .ql-picker.ql-background .ql-picker-label::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 3px;
        pointer-events: none;
      }
      .ql-snow .ql-picker.ql-color:hover .ql-picker-label,
      .ql-snow .ql-picker.ql-background:hover .ql-picker-label {
        border-color: rgba(124, 58, 237, 0.8);
        box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.5);
      }
      /* Color picker dropdown - Word-like grid */
      .ql-snow .ql-picker.ql-color .ql-picker-options,
      .ql-snow .ql-picker.ql-background .ql-picker-options {
        width: 152px;
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-item,
      .ql-snow .ql-picker.ql-background .ql-picker-item {
        width: 18px;
        height: 18px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-item:hover,
      .ql-snow .ql-picker.ql-background .ql-picker-item:hover {
        border-color: rgba(255, 255, 255, 0.6);
        transform: scale(1.1);
        z-index: 1;
        position: relative;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-item.ql-selected,
      .ql-snow .ql-picker.ql-background .ql-picker-item.ql-selected {
        border-color: rgba(124, 58, 237, 0.8);
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.4);
      }
      /* More Colors option styling */
      .ql-snow .ql-picker.ql-color .ql-picker-item[data-value="more"],
      .ql-snow .ql-picker.ql-background .ql-picker-item[data-value="more"] {
        grid-column: 1 / -1;
        width: 100%;
        height: 28px;
        background: rgba(124, 58, 237, 0.2);
        border-color: rgba(124, 58, 237, 0.5);
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        text-align: center;
        line-height: 28px;
      }
      .ql-snow .ql-picker.ql-color .ql-picker-item[data-value="more"]:hover,
      .ql-snow .ql-picker.ql-background .ql-picker-item[data-value="more"]:hover {
        background: rgba(124, 58, 237, 0.3);
      }
      .ql-snow a {
        color: #7c3aed;
        text-decoration: underline;
        cursor: pointer;
      }
      .ql-snow a:hover {
        color: #9f7aea;
        text-decoration: underline;
      }
      .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      .ql-editor h1 { font-size: 2em; }
      .ql-editor h2 { font-size: 1.5em; }
      .ql-editor h3 { font-size: 1.17em; }
      .ql-editor h4 { font-size: 1em; }
      .ql-editor h5 { font-size: 0.83em; }
      .ql-editor h6 { font-size: 0.67em; }
      .ql-size-small { font-size: 0.75em; }
      .ql-size-large { font-size: 1.5em; }
      .ql-size-huge { font-size: 2.5em; }
      .ql-size-12px { font-size: 12px !important; }
      .ql-size-14px { font-size: 14px !important; }
      .ql-size-16px { font-size: 16px !important; }
      .ql-size-18px { font-size: 18px !important; }
      .ql-size-20px { font-size: 20px !important; }
      .ql-size-24px { font-size: 24px !important; }
      .ql-size-28px { font-size: 28px !important; }
      .ql-size-32px { font-size: 32px !important; }
      .ql-size-40px { font-size: 40px !important; }
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
      /* Ensure color formatting is preserved in editor */
      .ql-editor [style*="color"] {
        color: inherit !important;
      }
      .ql-editor [style*="background-color"] {
        background-color: inherit !important;
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

  // Make links clickable in the editor and enhance color pickers
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const editorElement = quill.root;
      
      // Enable link clicking
      editorElement.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
          e.preventDefault();
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      });

      // Enhance color picker UI - add "More Colors" option
      setTimeout(() => {
        const toolbar = quillRef.current?.getEditor()?.getModule('toolbar')?.container;
        if (toolbar) {
          // Find color and background color pickers
          const colorPickers = toolbar.querySelectorAll('.ql-color, .ql-background');
          colorPickers.forEach((picker) => {
            const options = picker.querySelector('.ql-picker-options');
            if (options && !options.querySelector('[data-value="more"]')) {
              // Add "More Colors" option at the end
              const moreOption = document.createElement('span');
              moreOption.className = 'ql-picker-item';
              moreOption.setAttribute('data-value', 'more');
              moreOption.setAttribute('data-label', 'More Colors...');
              moreOption.textContent = 'More Colors...';
              moreOption.style.cssText = 'grid-column: 1 / -1; width: 100%; height: 28px; background: rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.5); color: rgba(255, 255, 255, 0.9); font-size: 12px; text-align: center; line-height: 28px; border-radius: 2px; margin-top: 4px; cursor: pointer;';
              moreOption.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isBackground = picker.classList.contains('ql-background');
                const input = document.createElement('input');
                input.type = 'color';
                const currentFormat = quill.getFormat();
                input.value = isBackground 
                  ? (currentFormat.background || '#ffffff')
                  : (currentFormat.color || '#000000');
                input.onchange = () => {
                  if (isBackground) {
                    quill.format('background', input.value);
                  } else {
                    quill.format('color', input.value);
                  }
                  // Close the picker
                  picker.classList.remove('ql-expanded');
                };
                input.click();
              });
              options.appendChild(moreOption);
            }
          });
        }
      }, 100);
    }
  }, [value]);

  return (
    <div className="rich-text-editor-wrapper space-y-2">
      <div className="text-xs text-white/70 px-1 pb-1 select-none" title="You can change font size using the toolbar dropdown. Includes normal, large, huge, and px values.">
        Tip: Use the second dropdown in the toolbar to change font size (named sizes or px values supported).
      </div>
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

