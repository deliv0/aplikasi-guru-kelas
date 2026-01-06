import { createClass } from './actions'
import Link from 'next/link'

export default function CreateClassPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Kelas Baru</h1>
        <p className="text-gray-500 mb-6">Masukkan nama kelas yang ingin Anda ajar.</p>

        <form action={createClass} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kelas
            </label>
            <input
              name="className"
              type="text"
              placeholder="Contoh: Kelas 6A"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link 
              href="/dashboard"
              className="flex-1 px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Simpan Kelas
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}