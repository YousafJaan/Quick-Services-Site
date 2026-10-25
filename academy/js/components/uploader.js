/**
 * Quick Academy Image Processing & Upload Component
 * Provides client-side compression (WebP), decagonal avatar framing,
 * and drag-and-drop dropzone management.
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/**
 * Compresses and resizes an image file using an HTML5 Canvas.
 * Returns { blob, dataUrl, width, height, size, originalName }
 */
export async function processImageFile(file, options = {}) {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
    cropSquare = false
  } = options;

  const isMimeOk = ALLOWED_TYPES.includes(file.type);
  const isExtOk = file.name && /\.(png|jpe?g|webp|gif)$/i.test(file.name);

  if (!isMimeOk && !isExtOk) {
    throw new Error('Unsupported image format. Please select a PNG, JPG, or WebP image.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size exceeds 5MB limit. Please select a smaller image.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let srcX = 0;
        let srcY = 0;
        let srcWidth = img.width;
        let srcHeight = img.height;

        let targetWidth = img.width;
        let targetHeight = img.height;

        if (cropSquare) {
          const minDim = Math.min(img.width, img.height);
          srcX = (img.width - minDim) / 2;
          srcY = (img.height - minDim) / 2;
          srcWidth = minDim;
          srcHeight = minDim;
          targetWidth = Math.min(minDim, maxWidth);
          targetHeight = targetWidth;
        } else {
          if (targetWidth > maxWidth) {
            targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
            targetWidth = maxWidth;
          }
          if (targetHeight > maxHeight) {
            targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
            targetHeight = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, targetWidth, targetHeight);

        // Convert to WebP with fallback
        let mimeType = 'image/webp';
        let dataUrl;
        try {
          dataUrl = canvas.toDataURL(mimeType, quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            mimeType = 'image/png';
            dataUrl = canvas.toDataURL(mimeType);
          }
        } catch {
          mimeType = 'image/png';
          dataUrl = canvas.toDataURL(mimeType);
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            // PNG Fallback
            canvas.toBlob((pngBlob) => {
              if (!pngBlob) {
                reject(new Error('Failed to process image canvas'));
                return;
              }
              resolve({
                blob: pngBlob,
                dataUrl: canvas.toDataURL('image/png'),
                width: targetWidth,
                height: targetHeight,
                size: pngBlob.size,
                originalName: file.name
              });
            }, 'image/png');
            return;
          }
          resolve({
            blob,
            dataUrl,
            width: targetWidth,
            height: targetHeight,
            size: blob.size,
            originalName: file.name
          });
        }, mimeType, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image element'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Renders an interactive Drag-and-Drop Dropzone.
 */
export function createDropzone(containerEl, options = {}) {
  const {
    id = 'qsa-dropzone',
    title = 'Drag & Drop research image here',
    subtitle = 'Supports PNG, JPG, or WebP (up to 5MB)',
    cropSquare = false,
    maxDim = 800,
    onSuccess = () => {},
    onError = () => {}
  } = options;

  containerEl.innerHTML = `
    <div class="claude-dropzone" id="${id}">
      <input type="file" id="${id}-input" accept="image/png,image/jpeg,image/webp" style="display: none;">
      <div class="claude-dropzone-icon">📷</div>
      <div class="claude-dropzone-title">${title}</div>
      <div class="claude-dropzone-subtitle">${subtitle}</div>
      <button type="button" class="claude-btn-dark btn-sm" id="${id}-browse-btn" style="margin-top: 12px;">
        Browse File
      </button>
      <div class="claude-dropzone-loader" id="${id}-loader" style="display: none;">
        <span class="spinner"></span> <span>Compressing &amp; formatting image...</span>
      </div>
    </div>`;

  const dropzone = containerEl.querySelector(`#${id}`);
  const input = containerEl.querySelector(`#${id}-input`);
  const browseBtn = containerEl.querySelector(`#${id}-browse-btn`);
  const loader = containerEl.querySelector(`#${id}-loader`);

  const handleFiles = async (files) => {
    console.log(`[Dropzone ${id}] handleFiles received:`, files?.length ? files[0].name : 'no files');
    if (!files || !files.length) return;
    const file = files[0];

    try {
      if (loader) loader.style.display = 'flex';
      const result = await processImageFile(file, {
        maxWidth: maxDim,
        maxHeight: maxDim,
        cropSquare
      });
      console.log(`[Dropzone ${id}] processImageFile completed:`, result.width, 'x', result.height, result.size, 'bytes');
      if (loader) loader.style.display = 'none';
      onSuccess(result);
    } catch (err) {
      console.error(`[Dropzone ${id}] Error processing file:`, err);
      if (loader) loader.style.display = 'none';
      if (window.showGlobalToast) {
        window.showGlobalToast(err.message);
      }
      onError(err);
    }
  };

  browseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    input.click();
  });

  input.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag and drop event listeners
  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      handleFiles(dt.files);
    }
  });
}
