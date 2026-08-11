import React from 'react'

function FileList({ dokumen, loading }) {
  const totalFiles = dokumen.filter(d => d.file_url && d.file_url.length > 0).length
  const files = dokumen.filter(d => d.file_url && d.file_url.length > 0)

  const countPDF = files.filter(d => d.file_url?.includes('.pdf')).length
  const countImages = files.filter(d => d.file_url?.includes('.jpg') || d.file_url?.includes('.png') || d.file_url?.includes('.jpeg')).length
  const countWord = files.filter(d => d.file_url?.includes('.doc') || d.file_url?.includes('.docx')).length

  return (
    <div className="files-page">
      <div className="files-stats">
        <div className="files-stat-card">
          <span className="files-stat-number">{totalFiles}</span>
          <span className="files-stat-label">Total File</span>
        </div>
        <div className="files-stat-card">
          <span className="files-stat-number">{countPDF}</span>
          <span className="files-stat-label">PDF</span>
        </div>
        <div className="files-stat-card">
          <span className="files-stat-number">{countImages}</span>
          <span className="files-stat-label">Gambar</span>
        </div>
        <div className="files-stat-card">
          <span className="files-stat-number">{countWord}</span>
          <span className="files-stat-label">Word</span>
        </div>
      </div>

      <div className="files-list">
        <h3 className="section-title-mini"><i className="fas fa-list"></i> Daftar File</h3>
        {loading ? (
          <div className="loading"><i className="fas fa-spinner fa-pulse"></i><br />Memuat...</div>
        ) : files.length === 0 ? (
          <div className="empty-state"><i className="fas fa-search-minus"></i><br />Belum ada file</div>
        ) : (
          <div className="file-grid">
            {files.map((item) => (
              <div className="file-card" key={item.id}>
                <div className="file-card-icon">
                  {item.file_url?.includes('.pdf') ? <i className="fas fa-file-pdf" style={{color: '#dc2626'}}></i> :
                   item.file_url?.includes('.doc') || item.file_url?.includes('.docx') ? <i className="fas fa-file-word" style={{color: '#2563eb'}}></i> :
                   item.file_url?.includes('.xls') || item.file_url?.includes('.xlsx') ? <i className="fas fa-file-excel" style={{color: '#16a34a'}}></i> :
                   item.file_url?.includes('.jpg') || item.file_url?.includes('.png') || item.file_url?.includes('.jpeg') ? <i className="fas fa-file-image" style={{color: '#8b5cf6'}}></i> :
                   <i className="fas fa-file" style={{color: '#6b7280'}}></i>}
                </div>
                <div className="file-card-info">
                  <span className="file-card-name">{item.file_name || 'File'}</span>
                  <span className="file-card-doc">{item.nama}</span>
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="file-card-download">
                    <i className="fas fa-download"></i> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FileList