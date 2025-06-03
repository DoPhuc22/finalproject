import { message } from 'antd';

// Validate image file
export const validateImageFile = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
  if (!isJpgOrPng) {
    message.error('Chỉ hỗ trợ file JPG/PNG/WEBP!');
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Kích thước file phải nhỏ hơn 2MB!');
    return false;
  }

  return true;
};

// Convert file to base64
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Upload to server (placeholder - replace with actual upload logic)
export const uploadImage = async (file) => {
  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, you would upload to your server or cloud storage
    // For now, we'll just return a mock URL
    const mockUrl = URL.createObjectURL(file);
    
    return {
      url: mockUrl,
      name: file.name,
      size: file.size
    };
  } catch (error) {
    throw new Error('Upload failed');
  }
};

// Remove uploaded image
export const removeImage = async (imageUrl) => {
  try {
    // Simulate API call to remove image
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revoke object URL to free memory
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    
    return true;
  } catch (error) {
    throw new Error('Remove failed');
  }
};

// Create thumbnail
export const createThumbnail = (file, maxWidth = 150, maxHeight = 150) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and convert to blob
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
};