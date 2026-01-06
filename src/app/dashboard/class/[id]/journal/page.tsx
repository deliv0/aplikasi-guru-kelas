'use client'

import { useState, useEffect } from 'react'
import { getJournals, addJournal, deleteJournal } from './actions'
import Link from 'next/link'

export default function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const [journals, setJournals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [classId, setClassId] = useState('')

  useEffect(() => {
    params.then(p => {
      setClassId(p.id)
      loadJournals(p.id)
    })
  }, [params])

  async function loadJournals(cid: string) {
    const res = await getJournals(cid)
    if (res.data) setJournals(res.data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const res = await addJournal(classId, formData)

    if (res.success) {
      window.alert("✅ Jurnal berhasil disimpan!")
      ;(e.target as HTMLFormElement).reset() 
      loadJournals(classId)
    } else {
      window.alert("❌ Gagal: " + res.message)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
      if(!window.confirm("Yakin mau hapus catatan jurnal ini?")) return;
      await deleteJournal(id, classId)
      loadJournals(classId)
  }

  // --- STYLE VARIABLES ---
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1"
  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* BAGIAN KIRI: FORM INPUT (Sticky) */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Header Form */}
            <div className="bg-blue-600 p-6 text-white">
                <Link href={`/dashboard/class/${classId}`} className="text-blue-100 hover:text-white text-sm font-medium flex items-center gap-1 mb-3 transition">
                    &larr; Kembali
                </Link>
                <h2 className="text-2xl font-extrabold tracking-tight">Tulis Jurnal</h2>
                <p className="text-blue-100 text-sm mt-1 opacity-90">Catat materi & kejadian hari ini.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className={labelStyle}>Tanggal Kegiatan</label>
                <input type="date" name="date" required 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className={inputStyle} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className={labelStyle}>Jam Ke-</label>
                      <input type="text" name="jam_ke" placeholder="1 - 2" required className={`${inputStyle} text-center`} />
                  </div>
                  <div>
                      <label className={labelStyle}>Mata Pelajaran</label>
                      <input type="text" name="mapel" placeholder="Matematika" required className={inputStyle} />
                  </div>
              </div>

              <div>
                <label className={labelStyle}>Materi / Topik Pembahasan</label>
                <textarea name="materi" rows={4} placeholder="Contoh: Membahas bab pecahan desimal dan latihan soal halaman 40..." required className={inputStyle} ></textarea>
              </div>

              <div>
                <label className={labelStyle}>Catatan Khusus (Opsional)</label>
                <div className="relative">
                    <span className="absolute top-3 left-3 text-gray-400">📝</span>
                    <textarea name="catatan" rows={2} placeholder="Siswa sangat antusias, Budi izin ke UKS..." className={`${inputStyle} pl-10`} ></textarea>
                </div>
              </div>

              <button type="submit" disabled={submitting} 
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 transform active:scale-95 disabled:bg-gray-400 disabled:shadow-none mt-2">
                  {submitting ? '⏳ Menyimpan...' : '💾 Simpan Jurnal'}
              </button>
            </form>
          </div>
        </div>

        {/* BAGIAN KANAN: TIMELINE RIWAYAT */}
        <div className="w-full lg:w-2/3 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex items-center gap-3">
                   <div className="bg-purple-100 p-2 rounded-lg text-purple-600">📚</div>
                   <div>
                       <h2 className="font-bold text-gray-900 text-lg">Riwayat Jurnal</h2>
                       <p className="text-gray-500 text-xs">Total {journals.length} catatan tersimpan</p>
                   </div>
               </div>
            </div>
          
          {loading ? (
              <div className="space-y-4 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>)}
              </div>
          ) : journals.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4 opacity-20">✍️</div>
                  <h3 className="text-lg font-bold text-gray-900">Belum ada catatan</h3>
                  <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                      Jurnal mengajar Anda masih kosong. Yuk, mulai tulis kegiatan hari ini di formulir sebelah kiri!
                  </p>
              </div>
          ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {journals.map((j) => (
                      <div key={j.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          
                          {/* TITIK TIMELINE (BULLET) */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-white font-bold text-xs">
                             ✓
                          </div>
                          
                          {/* KARTU KONTEN */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group-hover:border-blue-200 relative">
                              
                              {/* Tanggal & Hapus */}
                              <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                                  <div>
                                      <span className="font-extrabold text-blue-600 text-lg block">{j.date}</span>
                                      <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded mt-1 inline-block">Jam Ke: {j.jam_ke}</span>
                                  </div>
                                  <button onClick={() => handleDelete(j.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition" title="Hapus Catatan">
                                      🗑️
                                  </button>
                              </div>
                              
                              <h3 className="font-bold text-xl text-gray-900 mb-2">{j.mapel}</h3>
                              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                  {j.materi}
                              </p>
                              
                              {j.catatan && (
                                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2 items-start">
                                      <span className="text-lg">📌</span>
                                      <p className="text-gray-600 text-xs italic mt-1">{j.catatan}</p>
                                  </div>
                              )}
                              
                              {/* Panah Dekoratif (Arrow) */}
                              <div className="absolute top-8 -right-2 w-4 h-4 bg-white border-t border-r border-gray-100 transform rotate-45 hidden md:block md:group-odd:right-auto md:group-odd:-left-2 md:group-odd:rotate-[225deg]"></div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
        </div>

      </div>
    </div>
  )
}