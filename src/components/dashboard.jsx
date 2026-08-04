import React from 'react'

function Dashboard({ dokumen, loading }) {
  const totalDokumen = dokumen.length
  const totalFiles = dokumen.filter(d => d.file_url && d.file_url.length > 0).length
  
  const countKeputusan = dokumen.filter(d => d.kategori === 'Keputusan').length
  const countNotulen = dokumen.filter(d => d.kategori === 'Notulen').length
  const countLaporan = dokumen.filter(d => d.kategori === 'Laporan').length
  const countSK = dokumen.filter(d => d.kategori === 'SK').length
  const countBAP = dokumen.filter(d => d.kategori === 'BAP').length

  return (
    <>
      {/* Statistik */}
      <div className="dashboard">
        <div className="dashboard-card total">
          <div className="dashboard-icon"><i className="fas fa-folder-open"></i></div>
          <div className="dashboard-info">
            <span className="dashboard-number">{totalDokumen}</span>
            <span className="dashboard-label">Total Dokumen</span>
          </div>
        </div>
        
        <div className="dashboard-card kategori">
          <div className="dashboard-icon"><i className="fas fa-tags"></i></div>
          <div className="dashboard-info">
            <div className="kategori-list">
              <span className="kategori-item badge-keputusan">Keputusan: {countKeputusan}</span>
              <span className="kategori-item badge-notulen">Notulen: {countNotulen}</span>
              <span className="kategori-item badge-laporan">Laporan: {countLaporan}</span>
              <span className="kategori-item badge-sk">SK: {countSK}</span>
              <span className="kategori-item badge-bap">BAP: {countBAP}</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card files">
          <div className="dashboard-icon"><i className="fas fa-paperclip"></i></div>
          <div className="dashboard-info">
            <span className="dashboard-number">{totalFiles}</span>
            <span className="dashboard-label">File Terupload</span>
          </div>
        </div>
      </div>

      {/* Tabel Dokumen Terbaru */}
      <div className="table-wrap">
        <h3 className="section-title-mini"><i className="fas fa-list"></i> Dokumen Terbaru</h3>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tahun</th>
              <th>Kategori</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="loading"><i className="fas fa-spinner fa-pulse"></i><br />Memuat...</td></tr>
            ) : dokumen.length === 0 ? (
              <tr><td colSpan="4" className="empty-state">Belum ada dokumen</td></tr>
            ) : (
              dokumen.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td><span className="badge-year">{item.tahun}</span></td>
                  <td><span className={`badge-kategori badge-${item.kategori.toLowerCase()}`}>{item.kategori}</span></td>
                  <td>{item.file_url ? <i className="fas fa-paperclip" style={{color: '#2d7a4f'}}></i> : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Dashboard