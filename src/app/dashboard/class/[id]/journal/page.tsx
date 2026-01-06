'use client'

import { useState, useEffect } from 'react'
import { getJournals, addJournal, deleteJournal } from './actions'
import Link from 'next/link'

export default function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const [journals, setJournals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [classId, setClassId] = useState('')

  // Load Data saat pertama buka
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

  // Handle saat Form dikirim
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const res = await addJournal(classId, formData)

    if (res.success) {
      alert("Jurnal berhasil disimpan! ✅")
      // Reset form manual atau reload data
      (e.target as HTMLFormElement).reset() 
      loadJournals(classId)
    } else {
      alert("Gagal: " + res.message)
    }
    setSubmitting(false)
  }

  // Handle Hapus
  async function handleDelete(id: string) {
      if(!confirm("Yakin mau hapus jurnal ini?")) return;
      await deleteJournal(id, classId)
      loadJournals(classId)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      
      {/* BAGIAN KIRI: FORM INPUT */}
      <div className="w-full md:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow-md border sticky top-6">
          <div className="mb-4">
            <Link href={`/dashboard/class/${classId}`} className="text-blue-600 hover:underline text-sm block mb-2">
                &larr; Kembali
            </Link>
            <h2 className="text-xl font-bold text-gray-800">Tulis Jurnal</h2>
            <p className="text-gray-500 text-xs">Catat kegiatan mengajar hari ini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal</label>
              <input type="date" name="date" required 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jam Ke-</label>
                    <input type="text" name="jam_ke" placeholder="1-2" required 
                        className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mapel</label>
                    <input type="text" name="mapel" placeholder="Matematika" required 
                        className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Materi / Topik</label>
              <textarea name="materi" rows={2} placeholder="Membahas pecahan..." required 
                className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Catatan Khusus (Opsional)</label>
              <textarea name="catatan" rows={2} placeholder="Siswa antusias, Budi sakit..." 
                className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} 
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400">
                {submitting ? 'Menyimpan...' : 'Simpan Jurnal'}
            </button>
          </form>
        </div>
      </div>

      {/* BAGIAN KANAN: DAFTAR RIWAYAT */}
      <div className="w-full md:w-2/3">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Mengajar</h2>
        
        {loading ? (
            <p className="text-gray-500">Memuat data...</p>
        ) : journals.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center border border-dashed">
                <p className="text-gray-500">Belum ada jurnal. Mulai tulis di samping kiri!</p>
            </div>
        ) : (
            <div className="space-y-4">
                {journals.map((j) => (
                    <div key={j.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition relative group">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                    {j.date}
                                </span>
                                <span className="ml-2 text-gray-500 text-xs font-mono">
                                    Jam: {j.jam_ke}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(j.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                                🗑️
                            </button>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-800 mt-2">{j.mapel}</h3>
                        <p className="text-gray-600 text-sm mt-1 border-l-4 border-blue-200 pl-2">
                            {j.materi}
                        </p>
                        
                        {j.catatan && (
                            <p className="text-gray-500 text-xs mt-3 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                                📝 Catatan: {j.catatan}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  )
}