import React from 'react'

function AdminPanel({ dokumen }) {
  const totalDokumen = dokumen.length
  const totalFiles = dokumen.filter(d => d.file_url && d.file_url.length > 0).length
  const kategoriCount = Object.keys(dokumen.reduce((acc, d) => { acc[d.kategori] = true; return acc }, {})).length
  
  const tahunMap = dokumen.reduce((acc, d) => { 
    acc[d.tahun] = (acc[d.tahun] || 0) + 1; 
    return acc 
  }, {})
  const tahunTerbanyak = Object.entries(tahunMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

  return (
    <div className="admin-page">
      <h2 className="section-title-mini"><i className="fas fa-user-shield"></i> Panel Admin</h2>
      <div className="admin-grid">
        <div className="admin-card">
          <i className="fas fa-file-alt"></i>
          <h4>Total Dokumen</h4>
          <span className="admin-number">{totalDokumen}</span>
        </div>
        <div className="admin-card">
          <i className="fas fa-paperclip"></i>
          <h4>Total File</h4>
          <span className="admin-number">{totalFiles}</span>
        </div>
        <div className="admin-card">
          <i className="fas fa-tags"></i>
          <h4>Kategori</h4>
          <span className="admin-number">{kategoriCount}</span>
        </div>
        <div className="admin-card">
          <i className="fas fa-calendar"></i>
          <h4>Tahun Terbanyak</h4>
          <span className="admin-number">{tahunTerbanyak}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel