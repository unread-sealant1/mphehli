import { useState } from 'react';
import { uploadService } from '../services/uploadService';
import { X, Folder } from 'lucide-react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ value, onChange, label = 'Upload Image', accept = 'image/*' }) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const uploadedUrl = await uploadService.uploadImage(file);
      onChange(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.dropzone}>
        {preview ? (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Preview" className={styles.previewImg} />
            <button
              type="button"
              onClick={() => { setPreview(null); onChange(''); }}
              className={styles.removeBtn}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className={styles.fileInputLabel}>
            {uploading ? (
              <div className={styles.loadingWrapper}>
                <div className={styles.spinner} />
                <span className={styles.uploadText}>Uploading...</span>
              </div>
            ) : (
              <>
                <span className={styles.uploadIcon}><Folder size={24} /></span>
                <span className={styles.uploadText}>Click to upload image</span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className={styles.hiddenInput}
                  disabled={uploading}
                />
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
