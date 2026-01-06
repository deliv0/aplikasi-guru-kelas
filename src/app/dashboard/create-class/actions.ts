'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createClass(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const className = formData.get('className') as string

  // 2. Simpan dengan data LENGKAP
  // Kita coba pakai "SD" dan "C" (untuk kelas 5-6 SD/MI)
  // Tahun ajaran kita set otomatis tahun ini
  const { error } = await supabase.from('classes').insert({
    name: className,
    user_id: user.id,
    jenjang: 'SD',            // Coba ganti 'MI' jadi 'SD'
    fase: 'C',                // Fase C biasanya untuk Kelas 5-6
    academic_year: '2025/2026' // Tahun ajaran wajib diisi
  })

  if (error) {
    console.log("Error Supabase:", error.message)
    return redirect('/dashboard/create-class?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard')
}