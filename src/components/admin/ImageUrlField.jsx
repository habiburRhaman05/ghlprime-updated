import { useState } from 'react'
import { uploadImage } from '../../lib/apiClient'
import '../../styles/admin-extras.css'

// Shared image field for every admin form: lets the admin either paste an
// external image URL directly (existing behaviour) or upload a file straight
// to our own server, side by side. Uploading calls POST /api/uploads/image
// and, on success, feeds the returned relative "/uploads/<file>" path back
// through onChange exactly like typing a URL would.
export default function ImageUrlField({ label, value, onChange, required = false, placeholder }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setUploadError('')

    const { data, error } = await uploadImage(file)

    if (error) {
      setUploadError(error.message || 'Upload failed.')
      setUploading(false)
      return
    }

    onChange(data.url)
    setUploading(false)
  }

  return (
    <div className="full-width image-url-field">
      <span className="image-url-field-label">{label}</span>
      <div className="image-url-field-row">
        <input
          type="text"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder || 'https://...'}
          required={required}
        />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleFileChange}
          disabled={uploading}
          className="image-url-file-input"
        />
      </div>
      {uploading ? <span className="image-url-field-status">Uploading...</span> : null}
      {uploadError ? <span className="image-url-field-error">{uploadError}</span> : null}
      {value ? (
        <div className="admin-gallery-thumb image-url-field-preview">
          <img src={value} alt="Preview" onError={(event) => { event.currentTarget.style.display = 'none' }} />
        </div>
      ) : null}
    </div>
  )
}
