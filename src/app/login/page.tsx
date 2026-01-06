import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Aplikasi Guru Kelas
        </h1>
        
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap (Hanya untuk Daftar)</label>
            <input name="fullName" className="mt-1 block w-full rounded-md border border-gray-300 p-2" placeholder="Budi Santoso" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="mt-1 block w-full rounded-md border border-gray-300 p-2" placeholder="guru@sekolah.id" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="mt-1 block w-full rounded-md border border-gray-300 p-2" placeholder="******" />
          </div>

          <div className="flex gap-2 mt-4">
            <button formAction={login} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Masuk
            </button>
            <button formAction={signup} className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition">
              Daftar Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
