'use server'

import { createClient } from '@/utils/supabase/server'

// Fungsi 1: Ambil Data Siswa + Data Absensi di Tanggal Tertentu
export async function getAttendanceData(classId: string, date: string) {
  const supabase = await createClient()

  // A. Ambil semua siswa di kelas ini
  const { data: students, error: errStudent } = await supabase
    .from('students')
    .select('id, full_name, gender')
    .eq('class_id', classId)
    .order('full_name', { ascending: true })

  if (errStudent) return { error: errStudent.message }

  // B. Ambil data absensi pada tanggal yang dipilih
  const { data: attendance, error: errAttendance } = await supabase
    .from('attendance')
    .select('student_id, status')
    .eq('class_id', classId)
    .eq('date', date)

  if (errAttendance) return { error: errAttendance.message }

  // C. Gabungkan datanya
  // Kita bikin format yang enak dibaca sama halaman depan
  const combinedData = students.map(student => {
    // Cari apakah siswa ini punya catatan absen di tanggal tsb?
    const record = attendance.find(a => a.student_id === student.id)
    return {
      student_id: student.id,
      name: student.full_name,
      gender: student.gender,
      status: record ? record.status : null // Kalau belum absen, null
    }
  })

  return { data: combinedData }
}

// Fungsi 2: Simpan Absensi (Bisa Banyak Sekaligus)
export async function saveAttendance(classId: string, date: string, records: any[]) {
  const supabase = await createClient()

  // Siapkan data untuk disimpan
  const dataToUpsert = records.map(record => ({
    class_id: classId,
    student_id: record.student_id,
    date: date,
    status: record.status
  }))

  // Pake UPSERT: Kalau ada update, kalau gak ada insert.
  // Kuncinya ada di kolom (student_id, date) yang kita set UNIQUE di SQL tadi.
  const { error } = await supabase
    .from('attendance')
    .upsert(dataToUpsert, { onConflict: 'student_id, date' })

  if (error) {
    console.log("Error save:", error.message)
    return { success: false, message: error.message }
  }

  return { success: true }
}