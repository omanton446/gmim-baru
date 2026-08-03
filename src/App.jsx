import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  // ============================================================
  // STATE
  // ============================================================
  const [dokumen, setDokumen] = useState([])
  const [filteredDokumen, setFilteredDokumen] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [nama, setNama] = useState('')
  const [tahun, setTahun] = useState('')
  const [kategori, setKategori] = useState('Keputusan')
  const [isi, setIsi] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  
  // State untuk file
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [filePreview, setFilePreview] = useState('')

  // ============================================================
  // FETCH DATA
  // ============================================================
  async function fetchDokumen() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('dokumen')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setDokumen(data || [])
      setFilteredDokumen(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal ambil data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // FILTER
  // ============================================================
  function handleFilter() {
    const keyword = document.getElementById('searchInput')?.value?.toLowerCase() || ''
    const kategoriFilter = document.getElementById('filterKategori')?.value || 'semua'
    const tahunFilter = document.getElementById('filterTahun')?.value || 'semua'
    
    const filtered = dokumen.filter(item => {
      if (kategoriFilter !== 'semua' && item.kategori !== kategoriFilter) return false
      if (tahunFilter !== 'semua' && item.tahun !== tahunFilter) return false
      if (keyword) {
        const match = 
          item.nama.toLowerCase().includes(keyword) ||
          (item.isi && item.isi.toLowerCase().includes(keyword)) ||
          item.tahun.includes(keyword) ||
          (item.file_name && item.file_name.toLowerCase().includes(keyword))
        if (!match) return false
      }
      return true
    })
    setFilteredDokumen(filtered)
  }

  function resetFilter() {
    const kategoriSelect = document.getElementById('filterKategori')
    const tahunSelect = document.getElementById('filterTahun')
    const searchInput = document.getElementById('searchInput')
    if (kategoriSelect) kategoriSelect.value = 'semua'
    if (tahunSelect) tahunSelect.value = 'semua'
    if (searchInput) searchInput.value = ''
    setFilteredDokumen(dokumen)
  }

  function updateTahunFilter() {
    const tahunSelect = document.getElementById('filterTahun')
    if (!tahunSelect) return
    const tahunSet = new Set()
    dokumen.forEach(item => {
      if (item.tahun) {
        const tahunStr = String(item.tahun).trim()
        if (tahunStr && !isNaN(tahunStr)) {
          tahunSet.add(tahunStr)
        }
      }
    })
    const manualTahun = ['2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025']
    manualTahun.forEach(t => tahunSet.add(t))
    const validYears = [...tahunSet].filter(t => !isNaN(t) && t.length === 4)
    const tahunList = validYears.sort((a, b) => Number(b) - Number(a))
    const currentValue = tahunSelect.value
    tahunSelect.innerHTML = '<option value="semua">📅 Semua Tahun</option>'
    tahunList.forEach(t => {
      tahunSelect.innerHTML += `<option value="${t}">${t}</option>`
    })
    if (tahunList.includes(currentValue)) {
      tahunSelect.value = currentValue
    } else {
      tahunSelect.value = 'semua'
    }
  }

  // ============================================================
  // UPLOAD FILE
  // ============================================================
  async function uploadFile(file) {
    if (!file) return null
    setUploading(true)
    try {
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File terlalu besar! Maksimal 50MB')
      }
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `dokumen/${fileName}`
      const { data, error } = await supabase.storage
        .from('dokumen')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (error) throw new Error(error.message)
      const { data: urlData } = supabase.storage
        .from('dokumen')
        .getPublicUrl(filePath)
      return { path: filePath, url: urlData.publicUrl, name: file.name, size: file.size }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload gagal: ' + error.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  // ============================================================
  // CRUD
  // ============================================================
  async function tambahDokumen(e) {
    e.preventDefault()
    if (!isAdmin) {
      alert('Anda harus login sebagai admin!')
      return
    }
    if (!nama || !tahun || !kategori) {
      alert('Isi semua field wajib!')
      return
    }
    try {
      let fileData = null
      if (file) {
        fileData = await uploadFile(file)
      }
      const { error } = await supabase
        .from('dokumen')
        .insert([{ 
          nama, tahun, kategori, isi,
          file_name: fileData?.name || '',
          file_path: fileData?.path || '',
          file_url: fileData?.url || '',
          file_size: fileData?.size || 0
        }])
      if (error) throw error
      resetForm()
      await fetchDokumen()
      alert('✅ Dokumen berhasil ditambahkan!')
    } catch (error) {
      alert('❌ Gagal tambah: ' + error.message)
    }
  }

  async function updateDokumen(e) {
    e.preventDefault()
    if (!isAdmin) return
    if (!nama || !tahun || !kategori) {
      alert('Isi semua field wajib!')
      return
    }
    try {
      let fileData = null
      if (file) {
        fileData = await uploadFile(file)
      }
      const updateData = { nama, tahun, kategori, isi }
      if (fileData) {
        updateData.file_name = fileData.name
        updateData.file_path = fileData.path
        updateData.file_url = fileData.url
        updateData.file_size = fileData.size
      }
      const { error } = await supabase
        .from('dokumen')
        .update(updateData)
        .eq('id', editingId)
      if (error) throw error
      resetForm()
      await fetchDokumen()
      alert('✅ Dokumen berhasil diupdate!')
    } catch (error) {
      alert('❌ Gagal update: ' + error.message)
    }
  }

  async function hapusDokumen(id) {
    if (!isAdmin) return
    if (!confirm('⚠️ Yakin hapus dokumen ini?')) return
    if (!confirm('Konfirmasi kedua: Hapus permanen?')) return
    try {
      const item = dokumen.find(d => d.id === id)
      if (item?.file_path) {
        try {
          await supabase.storage.from('dokumen').remove([item.file_path])
        } catch (err) {}
      }
      const { error } = await supabase
        .from('dokumen')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchDokumen()
    } catch (error) {
      alert('❌ Gagal hapus: ' + error.message)
    }
  }

  function editDokumen(item) {
    if (!isAdmin) return
    setEditingId(item.id)
    setNama(item.nama)
    setTahun(item.tahun)
    setKategori(item.kategori)
    setIsi(item.isi || '')
    setFile(null)
    const fileInput = document.getElementById('fileInput')
    if (fileInput) fileInput.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setNama('')
    setTahun('')
    setKategori('Keputusan')
    setIsi('')
    setFile(null)
    setFilePreview('')
    const fileInput = document.getElementById('fileInput')
    if (fileInput) fileInput.value = ''
  }

  // ============================================================
  // LOGIN
  // ============================================================
  async function loginAdmin(e) {
    e.preventDefault()
    setLoginError('')
    try {
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', username)
      if (error) throw error
      if (data.length === 0) {
        setLoginError('Username tidak ditemukan!')
        return
      }
      if (password === data[0].password_hash) {
        setIsAdmin(true)
        setShowLogin(false)
        setUsername('')
        setPassword('')
      } else {
        setLoginError('Password salah!')
      }
    } catch (error) {
      setLoginError('Error: ' + error.message)
    }
  }

  function logout() {
    setIsAdmin(false)
    resetForm()
  }

  // ============================================================
  // EFFECT
  // ============================================================
  useEffect(() => {
    fetchDokumen()
  }, [])

  useEffect(() => {
    if (dokumen.length > 0) {
      updateTahunFilter()
    }
  }, [dokumen])

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1>
          <span className="logo-icon"><i className="fas fa-cross"></i></span>
          Arsip Dokumen GMIM
        </h1>
        <div className="header-actions">
          <span className="badge">
            <span className="dot"></span>
            {isAdmin ? '👑 Admin' : '👀 Lihat Saja'}
          </span>
          {!isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowLogin(!showLogin)}>
              <i className="fas fa-lock"></i> Login
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-danger" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>

      {/* LOGIN */}
      {showLogin && !isAdmin && (
        <div className="login-box">
          <div className="login-icon"><i className="fas fa-lock"></i></div>
          <h2>Login Admin</h2>
          {loginError && <div className="error">{loginError}</div>}
          <form onSubmit={loginAdmin}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
          </form>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="filter-group">
          <select id="filterKategori" onChange={handleFilter}>
            <option value="semua">📋 Semua</option>
            <option value="Keputusan">📜 Keputusan</option>
            <option value="Notulen">📝 Notulen</option>
            <option value="Laporan">📄 Laporan</option>
            <option value="SK">📋 SK</option>
            <option value="BAP">✅ BAP</option>
          </select>
          <select id="filterTahun" onChange={handleFilter}>
            <option value="semua">📅 Semua Tahun</option>
          </select>
        </div>
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Cari dokumen..." 
            onInput={handleFilter}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={resetFilter}>
          <i className="fas fa-undo-alt"></i> Reset
        </button>
      </div>

      {/* FORM */}
      {isAdmin && (
        <div className="form-container">
          <div className="form-title">
            <i className="fas fa-plus-circle"></i>
            {editingId ? '✏️ Edit Dokumen' : '📝 Tambah Dokumen'}
          </div>
          <form onSubmit={editingId ? updateDokumen : tambahDokumen} className="form-grid">
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
              <select 
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
              >
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
                id="fileInput"
                onChange={(e) => {
                  const selectedFile = e.target.files[0]
                  if (selectedFile) {
                    if (selectedFile.size > 50 * 1024 * 1024) {
                      alert('File terlalu besar! Maksimal 50MB')
                      e.target.value = ''
                      return
                    }
                    setFile(selectedFile)
                    setFilePreview(URL.createObjectURL(selectedFile))
                  }
                }}
              />
              {file && (
                <div className="file-info">
                  📎 {file.name} ({(file.size/1024).toFixed(1)} KB)
                  {filePreview && file.type.startsWith('image/') && (
                    <div style={{marginTop: '8px'}}>
                      <img src={filePreview} alt="Preview" style={{maxWidth: '150px', maxHeight: '150px', borderRadius: '8px'}} />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="form-group" style={{gridColumn: 'span 2', display:'flex', gap:'12px'}}>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                <i className="fas fa-save"></i> {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Simpan')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                <i className="fas fa-times"></i> {editingId ? 'Batal' : 'Bersihkan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><i className="fas fa-file-alt"></i> Nama</th>
              <th><i className="fas fa-calendar"></i> Tahun</th>
              <th><i className="fas fa-tag"></i> Kategori</th>
              <th><i className="fas fa-paperclip"></i> File</th>
              <th style={{textAlign:'center'}}><i className="fas fa-cogs"></i> Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading">
                  <i className="fas fa-spinner fa-pulse"></i>
                  <br />Memuat...
                </td>
              </tr>
            ) : filteredDokumen.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  <i className="fas fa-search-minus"></i>
                  <br />{dokumen.length === 0 ? 'Belum ada dokumen' : 'Tidak ada hasil pencarian'}
                </td>
              </tr>
            ) : (
              filteredDokumen.map((item) => (
                <tr key={item.id}>
                  <td>
                    <i className="fas fa-file-alt" style={{color:'#0a5c3a', marginRight:'8px'}}></i>
                    {item.nama}
                  </td>
                  <td><span className="badge-year">{item.tahun}</span></td>
                  <td>
                    <span className={`badge-kategori badge-${item.kategori.toLowerCase()}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="file-link">
                        <i className="fas fa-paperclip"></i> {item.file_name || 'File'}
                      </a>
                    ) : <span className="no-file">-</span>}
                  </td>
                  <td style={{textAlign:'center'}}>
                    <div className="action-cell">
                      <button 
                        className="btn-view" 
                        onClick={() => {
                          let msg = `📄 ${item.nama}\n📅 ${item.tahun}\n📂 ${item.kategori}\n📝 ${item.isi || '-'}`
                          if (item.file_url) msg += `\n📎 ${item.file_name || 'File'}`
                          alert(msg)
                        }}
                      >
                        <i className="fas fa-eye"></i> Lihat
                      </button>
                      {isAdmin && (
                        <button className="btn-edit" onClick={() => editDokumen(item)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                      )}
                      {isAdmin && (
                        <button className="btn-delete" onClick={() => hapusDokumen(item.id)}>
                          <i className="fas fa-trash"></i> Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <span><i className="fas fa-database"></i> Supabase</span>
        <span><i className="fas fa-shield-alt"></i> Data Online & Aman</span>
        <span>{filteredDokumen.length} dari {dokumen.length} dokumen</span>
      </div>
    </div>
  )
}

export default App