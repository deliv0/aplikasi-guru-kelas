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
      window.alert("Jurnal berhasil disimpan! ✅")
      ;(e.target as HTMLFormElement).reset() 
      loadJournals(classId)
    } else {
      window.alert("Gagal: " + res.message)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
      if(!window.confirm("Yakin mau hapus jurnal ini?")) return;
      await deleteJournal(id, classId)
      loadJournals(classId)
  }

  // CLASS STYLE INPUT YANG BAGUS (Reusable)
  const inputStyle = "w-full p-2.5 border border-gray-300 rounded-md mt-1 text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8 font-sans">
      
      {/* FORM INPUT */}
      <div className="w-full md:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
          <div className="mb-5 border-b pb-4">
            <Link href={`/dashboard/class/${classId}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mb-2">
                &larr; Kembali ke Kelas
            </Link>
            <h2 className="text-xl font-bold text-gray-800">Tulis Jurnal</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Tanggal</label>
              <input type="date" name="date" required 
                defaultValue={new Date().toISOString().split('T')[0]}
                className={inputStyle} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Jam Ke-</label>
                    <input type="text" name="jam_ke" placeholder="1-2" required className={inputStyle} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Mapel</label>
                    <input type="text" name="mapel" placeholder="MTK" required className={inputStyle} />
                </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Materi / Topik</label>
              <textarea name="materi" rows={3} placeholder="Membahas pecahan..." required className={inputStyle} ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Catatan (Opsional)</label>
              <textarea name="catatan" rows={2} placeholder="Kondisi kelas..." className={inputStyle} ></textarea>
            </div>

            <button type="submit" disabled={submitting} 
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-bold shadow-sm disabled:bg-gray-400 mt-2">
                {submitting ? 'Menyimpan...' : 'Simpan Jurnal'}
            </button>
          </form>
        </div>
      </div>

      {/* DAFTAR RIWAYAT */}
      <div className="w-full md:w-2/3">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Riwayat Mengajar</h2>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{journals.length} Data</span>
        </div>
        
        {loading ? (
            <div className="animate-pulse space-y-3">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
                <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
        ) : journals.length === 0 ? (
            <div className="bg-gray-50 p-10 rounded-xl text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Belum ada jurnal.</p>
                <p className="text-sm text-gray-400">Mulai tulis kegiatan mengajarmu di sisi kiri.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {journals.map((j) => (
                    <div key={j.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                                    📅 {j.date}
                                </span>
                                <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-1 rounded">
                                    ⏰ {j.jam_ke}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(j.id)} className="text-gray-300 hover:text-red-500 transition p-1" title="Hapus">
                                🗑️
                            </button>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-900">{j.mapel}</h3>
                        <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                            {j.materi}
                        </p>
                        
                        {j.catatan && (
                            <div className="mt-3 flex items-start gap-2 bg-yellow-50 p-2.5 rounded-lg border border-yellow-100">
                                <span className="text-yellow-600 mt-0.5">📝</span>
                                <p className="text-gray-600 text-xs italic">{j.catatan}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}