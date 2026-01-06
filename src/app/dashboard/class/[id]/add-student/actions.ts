'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function addStudent(classId: string, formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil data dari form
  const full_name = formData.get('full_name') as string
  const nisn = formData.get('nisn') as string
  const gender = formData.get('gender') as string // L atau P
  const parent_name = formData.get('parent_name') as string
  const parent_phone = formData.get('parent_phone') as string

  // 2. Simpan ke database
  const { error } = await supabase.from('students').insert({
    class_id: classId,    // ID Kelas (dari URL)
    full_name: full_name, // Wajib
    nisn: nisn || null,   // Jika kosong, set null
    gender: gender || null,
    parent_name: parent_name || null,
    parent_phone: parent_phone || null,
  })

  if (error) {
    console.log("Error tambah siswa:", error.message)
    return redirect(`/dashboard/class/${classId}/add-student?error=${encodeURIComponent(error.message)}`)
  }

  // 3. Sukses? Kembali ke halaman detail kelas
  redirect(`/dashboard/class/${classId}`)
}