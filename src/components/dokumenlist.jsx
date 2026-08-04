import React from 'react'

function DokumenList({ 
  loading, 
  dokumen, 
  isAdmin, 
  onEdit, 
  onDelete,
  onFilter,
  onReset
}) {
  return (
    <>
      <div className="toolbar">
        <div className="filter-group">
          <select id="filterKategori" onChange={onFilter}>
            <option value="semua">📋 Semua</option>
            <option value="Keputusan">📜 Keputusan</option>
            <option value="Notulen">📝 Notulen</option>
            <option value="Laporan">📄 Laporan</option>
            <option value="SK">📋 SK</option>
            <option value="BAP">✅ BAP</option>
          </select>
          <select id="filterTahun" onChange={onFilter}>
            <option value="semua">📅 Semua Tahun</option>
          </select>
        </div>
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input type="text" id="searchInput" placeholder="Cari dokumen..." onInput={onFilter} />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onReset}>
          <i className="fas fa-undo-alt"></i> Reset
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tahun</th>
              <th>Kategori</th>
              <th>File</th>
              <th style={{textAlign:'center'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="loading"><i className="fas fa-spinner fa-pulse"></i><br />Memuat...</td></tr>
            ) : dokumen.length === 0 ? (
              <tr><td colSpan="5" className="empty-state"><i className="fas fa-search-minus"></i><br />Tidak ada dokumen</td></tr>
            ) : (
              dokumen.map((item) => (
                <tr key={item.id}>
                  <td><i className="fas fa-file-alt" style={{color:'#2d7a4f', marginRight:'8px'}}></i>{item.nama}</td>
                  <td><span className="badge-year">{item.tahun}</span></td>
                  <td><span className={`badge-kategori badge-${item.kategori.toLowerCase()}`}>{item.kategori}</span></td>
                  <td>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="file-link">
                        <i className="fas fa-paperclip"></i> {item.file_name || 'File'}
                      </a>
                    ) : <span className="no-file">-</span>}
                  </td>
                  <td style={{textAlign:'center'}}>
                    <div className="action-cell">
                      <button className="btn-view" onClick={() => {
                        let msg = `📄 ${item.nama}\n📅 ${item.tahun}\n📂 ${item.kategori}\n📝 ${item.isi || '-'}`
                        if (item.file_url) msg += `\n📎 ${item.file_name || 'File'}`
                        alert(msg)
                      }}><i className="fas fa-eye"></i> Lihat</button>
                      {isAdmin && (
                        <button className="btn-edit" onClick={() => onEdit(item)}><i className="fas fa-edit"></i> Edit</button>
                      )}
                      {isAdmin && (
                        <button className="btn-delete" onClick={() => onDelete(item.id)}><i className="fas fa-trash"></i> Hapus</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DokumenList