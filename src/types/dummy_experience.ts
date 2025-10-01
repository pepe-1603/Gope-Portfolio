import supabase from '@/lib/supabaseClient'
import type { TablesInsert } from '@/types/supabase'

const testInsert = async () => {
  const payload: TablesInsert<'work_experience'> = {
    company: 'Prueba Corp',
    role: 'Desarrollador',
    start_date: '2023-01-01',
  }

  const { data, error } = await supabase
    .from('work_experience') // tipado OK gracias al `as const` en el service
    .insert([payload])
    .select()

  if (error) console.error(error)
  else console.log(data)
}
