import { addStudent } from './actions'
import Link from 'next/link'

export default async function AddStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const addStudentWithId = addStudent.bind(null, id)

  // CSS VARIABLES (Biar konsisten dan rapi)
  const labelStyle = "block text-sm font-bold text-gray-700 mb-2"
  const inputStyle = "w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      
      {/* CARD CONTAINER */}
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        
        {/* HEADER MEWAH */}
        <div className="bg-blue-600 p-8 text-center relative">
          {/* Hiasan background bulat transparan */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 text-3xl shadow-lg">
                👨‍🎓
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Siswa Baru</h1>
            <p className="text-blue-100 text-sm mt-1">Masukkan data siswa untuk didaftarkan ke kelas ini.</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-8">
            <form action={addStudentWithId} className="space-y-6">
            
            {/* GROUP 1: IDENTITAS UTAMA */}
            <div>
                <label className={labelStyle}>Nama Lengkap Siswa <span className="text-red-500">*</span></label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                    <input 
                        name="full_name" 
                        type="text" 
                        required 
                        placeholder="Contoh: Budi Santoso"
                        className={`${inputStyle} pl-11`} // Padding left extra buat ikon
                    />
                </div>
            </div>

            {/* GROUP 2: DATA AKADEMIK (GRID 2 KOLOM) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelStyle}>NISN / NIS</label>
                    <input 
                        name="nisn" 
                        type="text" 
                        placeholder="00123xxx"
                        className={inputStyle} 
                    />
                </div>
                <div>
                    <label className={labelStyle}>Jenis Kelamin</label>
                    <div className="relative">
                        <select name="gender" className={`${inputStyle} appearance-none cursor-pointer`}>
                            <option value="">- Pilih Gender -</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                        {/* Panah Custom biar ganteng */}
                        <div className="absolute right-4 top-4 text-gray-400 pointer-events-none text-xs">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* GROUP 3: DATA ORANG TUA */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data Wali Murid</h3>
                
                <div>
                    <label className={labelStyle}>Nama Orang Tua</label>
                    <input 
                        name="parent_name" 
                        type="text" 
                        placeholder="Nama Ayah / Ibu"
                        className={inputStyle} 
                    />
                </div>

                <div>
                    <label className={labelStyle}>No. HP / WhatsApp</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400">📞</span>
                        <input 
                            name="parent_phone" 
                            type="tel" 
                            placeholder="0812-xxxx-xxxx"
                            className={`${inputStyle} pl-11`}
                        />
                    </div>
                </div>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex gap-4 pt-2">
                <Link href={`/dashboard/class/${id}`} className="flex-1 px-4 py-3.5 text-center border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                    Batal
                </Link>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 hover:shadow-none transform active:scale-95">
                    Simpan Data
                </button>
            </div>

            </form>
        </div>
      </div>
    </div>
  )
}