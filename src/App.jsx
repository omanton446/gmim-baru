import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [dokumen, setDokumen] = useState([])
  const [loading, setLoading] = useState(true)
  const [nama, setNama] = useState('')
  const [tahun, setTahun] = useState('')
  const [kategori, setKategori] = useState('Keputusan')
  const [isi, setIsi] = useState('')

  // Ambil data dari Supabase
  async function fetchDokumen() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('dokumen')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setDokumen(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal ambil data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Tambah dokumen
  async function tambahDokumen(e) {
    e.preventDefault()
    if (!nama || !tahun || !kategori) {
      alert('Isi semua field!')
      return
    }
    try {
      const { error } = await supabase
        .from('dokumen')
        .insert([{ nama, tahun, kategori, isi }])
      if (error) throw error
      setNama('')
      setTahun('')
      setKategori('Keputusan')
      setIsi('')
      fetchDokumen()
      alert('✅ Berhasil ditambahkan!')
    } catch (error) {
      alert('❌ Gagal: ' + error.message)
    }
  }

  useEffect(() => {
    fetchDokumen()
  }, [])

  return (
    <div className="container">
      <h1>📁 Arsip Dokumen GMIM</h1>

      {/* Form Tambah */}
      <form onSubmit={tambahDokumen} className="form">
        <input
          type="text"
          placeholder="Nama Dokumen"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Tahun"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          required
        />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)} required>
          <option value="Keputusan">Keputusan</option>
          <option value="Notulen">Notulen</option>
          <option value="Laporan">Laporan</option>
          <option value="SK">SK</option>
          <option value="BAP">BAP</option>
        </select>
        <textarea
          placeholder="Deskripsi"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
        />
        <button type="submit">💾 Simpan</button>
      </form>

      {/* Tabel Data */}
      {loading ? (
        <p>Memuat...</p>
      ) : dokumen.length === 0 ? (
        <p>Belum ada dokumen</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tahun</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {dokumen.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.tahun}</td>
                <td>{item.kategori}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App