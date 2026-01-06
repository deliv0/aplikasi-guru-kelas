'use server'

import { createClient } from '@/utils/supabase/server'

// Kita definisikan bentuk datanya biar rapi
type StudentData = {
  full_name: string
  nisn: string
  gender: string
  parent_name: string
  parent_phone: string
}

export async function importStudents(classId: string, students: StudentData[]) {
  const supabase = await createClient()

  // 1. Cek Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Anda belum login' }
  }

  // 2. Siapkan data agar sesuai format Database
  const dataToInsert = students.map(student => ({
    class_id: classId,
    full_name: student.full_name,
    nisn: student.nisn || null,
    gender: student.gender || null, // Pastikan formatnya "L" atau "P"
    parent_name: student.parent_name || null,
    parent_phone: student.parent_phone || null
  }))

  // 3. Simpan ke Supabase (Sekaligus Banyak)
  const { error } = await supabase.from('students').insert(dataToInsert)

  if (error) {
    console.log("Error Import:", error.message)
    return { success: false, message: error.message }
  }

  // Jika sukses
  return { success: true }
}