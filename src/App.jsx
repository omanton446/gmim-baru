import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

// Import semua komponen
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import DokumenForm from './components/DokumenForm'
import DokumenList from './components/DokumenList'
import FileList from './components/FileList'
import AdminPanel from './components/AdminPanel'
import LoginBox from './components/LoginBox'

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
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [filePreview, setFilePreview] = useState('')
  const [activePage, setActivePage] = useState('dashboard')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ============================================================
  // FUNGSI CRUD
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
    setIsDropdownOpen(false)
  }

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
    <div className="app-container">
      <Navbar 
        isAdmin={isAdmin}
        onLogout={logout}
        onLogin={() => setShowLogin(true)}
        activePage={activePage}
        onNavigate={setActivePage}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      <main className="main-fullscreen">
        <div className="container-full">
          {/* HEADER */}
          <div className="header-full">
            <div className="header-left">
              <h1>
                <span className="logo-icon"><i className="fas fa-cross"></i></span>
                {activePage === 'dashboard' && 'Dashboard'}
                {activePage === 'dokumen' && 'Dokumen'}
                {activePage === 'files' && 'File Arsip'}
                {activePage === 'admin' && 'Panel Admin'}
              </h1>
            </div>
            <div className="header-actions">
              <span className="badge">
                <span className="dot"></span>
                {isAdmin ? '👑 Admin' : '👀 Lihat Saja'}
              </span>
            </div>
          </div>

        {/* LOGIN */}
{showLogin && !isAdmin && (
  <LoginBox 
    username={username}
    setUsername={setUsername}
    password={password}
    setPassword={setPassword}
    loginError={loginError}
    onLogin={loginAdmin}
    onCancel={() => {
      setShowLogin(false)
      setLoginError('')
      setUsername('')
      setPassword('')
    }}
  />
)}

          {/* DASHBOARD */}
          {activePage === 'dashboard' && (
            <Dashboard dokumen={dokumen} loading={loading} />
          )}

          {/* DOKUMEN */}
          {activePage === 'dokumen' && (
            <>
              <DokumenForm 
                isAdmin={isAdmin}
                editingId={editingId}
                nama={nama} setNama={setNama}
                tahun={tahun} setTahun={setTahun}
                kategori={kategori} setKategori={setKategori}
                isi={isi} setIsi={setIsi}
                file={file} setFile={setFile}
                uploading={uploading}
                onSave={editingId ? updateDokumen : tambahDokumen}
                onCancel={resetForm}
              />
              <DokumenList 
                loading={loading}
                dokumen={filteredDokumen}
                isAdmin={isAdmin}
                onEdit={editDokumen}
                onDelete={hapusDokumen}
                onFilter={handleFilter}
                onReset={resetFilter}
              />
            </>
          )}

          {/* FILES */}
          {activePage === 'files' && (
            <FileList dokumen={dokumen} loading={loading} />
          )}

          {/* ADMIN */}
          {activePage === 'admin' && isAdmin && (
            <AdminPanel dokumen={dokumen} />
          )}

          {/* FOOTER */}
          <div className="footer-full">
            <span><i className="fas fa-database"></i> Supabase</span>
            <span><i className="fas fa-shield-alt"></i> Data Online & Aman</span>
            <span>{filteredDokumen.length} dari {dokumen.length} dokumen</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App