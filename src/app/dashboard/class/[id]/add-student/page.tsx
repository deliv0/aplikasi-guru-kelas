import { addStudent } from './actions'
import Link from 'next/link'

export default async function AddStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // Ini adalah ID Kelas (class_id)

  // Kita bikin fungsi pembungkus agar bisa kirim ID Kelas ke actions
  const addStudentWithId = addStudent.bind(null, id)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tambah Siswa Baru</h1>
        <p className="text-gray-500 mb-6">Lengkapi data siswa untuk dimasukkan ke kelas ini.</p>

        <form action={addStudentWithId} className="space-y-4">
          {/* NAMA LENGKAP (Wajib) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
            <input name="full_name" type="text" required placeholder="Contoh: Ahmad Dahlan"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* NISN & GENDER */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
              <input name="nisn" type="text" placeholder="00123xxx"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select name="gender" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">- Pilih -</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          {/* ORANG TUA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
            <input name="parent_name" type="text" placeholder="Nama Ayah/Ibu"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Orang Tua (WhatsApp)</label>
            <input name="parent_phone" type="text" placeholder="0812xxxx"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex gap-3 pt-4">
            <Link href={`/dashboard/class/${id}`}
              className="flex-1 px-4 py-2 text-center border text-gray-700 rounded-md hover:bg-gray-50 transition">
              Batal
            </Link>
            <button type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Simpan Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}