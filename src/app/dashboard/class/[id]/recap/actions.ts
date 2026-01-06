'use server'

import { createClient } from '@/utils/supabase/server'

export async function getMonthlyRecap(classId: string, month: number, year: number) {
  const supabase = await createClient()

  // 1. Tentukan tanggal awal dan akhir bulan
  // Format: YYYY-MM-DD
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-31` // Supabase pintar, dia tau tgl 31 itu mentok

  // 2. Ambil Data Siswa (Urut Abjad)
  const { data: students, error: errStudents } = await supabase
    .from('students')
    .select('id, full_name')
    .eq('class_id', classId)
    .order('full_name', { ascending: true })

  if (errStudents) return { error: errStudents.message }

  // 3. Ambil Data Absensi (Rentang Tanggal)
  const { data: attendance, error: errAttendance } = await supabase
    .from('attendance')
    .select('student_id, date, status')
    .eq('class_id', classId)
    .gte('date', startDate)
    .lte('date', endDate)

  if (errAttendance) return { error: errAttendance.message }

  return { 
    students: students,
    attendance: attendance 
  }
}