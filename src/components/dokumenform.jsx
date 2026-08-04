import React from 'react'

function DokumenForm({ 
  isAdmin,
  editingId,
  nama, setNama,
  tahun, setTahun,
  kategori, setKategori,
  isi, setIsi,
  file, setFile,
  uploading,
  onSave,
  onCancel
}) {
  if (!isAdmin) return null

  return (
    <div className="form-container">
      <div className="form-title">
        <i className="fas fa-plus-circle"></i>
        {editingId ? '✏️ Edit Dokumen' : '📝 Tambah Dokumen'}
      </div>
      
      <form onSubmit={onSave} className="form-grid">
        <div className="form-group">
          <label><i className="fas fa-heading"></i> Nama *</label>
          <input 
            type="text" 
            placeholder="Nama dokumen..." 
            value={nama} 
            onChange={(e) => setNama(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label><i className="fas fa-calendar"></i> Tahun *</label>
          <input 
            type="number" 
            placeholder="2025" 
            value={tahun} 
            onChange={(e) => setTahun(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label><i className="fas fa-tag"></i> Kategori *</label>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} required>
            <option value="Keputusan">📜 Keputusan</option>
            <option value="Notulen">📝 Notulen</option>
            <option value="Laporan">📄 Laporan</option>
            <option value="SK">📋 SK</option>
            <option value="BAP">✅ BAP</option>
          </select>
        </div>
        
        <div className="form-group" style={{gridColumn: 'span 2'}}>
          <label><i className="fas fa-align-left"></i> Deskripsi</label>
          <textarea 
            placeholder="Deskripsi dokumen..." 
            rows="2" 
            value={isi} 
            onChange={(e) => setIsi(e.target.value)} 
          />
        </div>
        
        <div className="form-group" style={{gridColumn: 'span 2'}}>
          <label><i className="fas fa-paperclip"></i> File (Max 50MB)</label>
          <input 
            type="file" 
            onChange={(e) => {
              const selectedFile = e.target.files[0]
              if (selectedFile) {
                if (selectedFile.size > 50 * 1024 * 1024) {
                  alert('File terlalu besar! Maksimal 50MB')
                  e.target.value = ''
                  return
                }
                setFile(selectedFile)
              }
            }}
          />
          {file && (
            <div className="file-info">
              📎 {file.name} ({(file.size/1024).toFixed(1)} KB)
            </div>
          )}
        </div>
        
        <div className="form-group" style={{gridColumn: 'span 2', display:'flex', gap:'12px', flexWrap:'wrap'}}>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            <i className="fas fa-save"></i> {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Simpan')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <i className="fas fa-times"></i> {editingId ? 'Batal' : 'Bersihkan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DokumenForm