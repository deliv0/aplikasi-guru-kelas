import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        
        {/* LOGO & JUDUL */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            G
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aplikasi Guru</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk untuk mengelola kelas.</p>
        </div>

        <form className="flex flex-col gap-5">
          {/* INPUT EMAIL */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="nama@sekolah.com" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* TOMBOL */}
          <div className="flex flex-col gap-3 mt-2">
            <button formAction={login} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
              Masuk (Login)
            </button>
            <button formAction={signup} className="w-full bg-white text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
              Daftar Baru (Sign Up)
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}