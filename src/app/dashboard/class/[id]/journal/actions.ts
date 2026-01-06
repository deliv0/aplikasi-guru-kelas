'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Ambil Daftar Jurnal
export async function getJournals(classId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('class_id', classId)
    .order('date', { ascending: false }) // Yang terbaru di atas
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

// 2. Tambah Jurnal Baru
export async function addJournal(classId: string, formData: FormData) {
  const supabase = await createClient()

  const date = formData.get('date') as string
  const jam_ke = formData.get('jam_ke') as string
  const mapel = formData.get('mapel') as string
  const materi = formData.get('materi') as string
  const catatan = formData.get('catatan') as string

  const { error } = await supabase.from('journals').insert({
    class_id: classId,
    date,
    jam_ke,
    mapel,
    materi,
    catatan
  })

  if (error) return { success: false, message: error.message }
  
  // Refresh halaman biar data baru muncul
  revalidatePath(`/dashboard/class/${classId}/journal`)
  return { success: true }
}

// 3. Hapus Jurnal (Opsional, jaga-jaga kalau salah ketik)
export async function deleteJournal(id: string, classId: string) {
    const supabase = await createClient()
    await supabase.from('journals').delete().eq('id', id)
    revalidatePath(`/dashboard/class/${classId}/journal`)
}