
import { createClient } from '@/clients/server/supabase'
// import { cookies } from 'next/headers'

export default async function Page() {
    // const cookieStore = await cookies()
    // const supabase = createClient(cookieStore)

    // const { data: todos } = await supabase.from('todos').select()

    // return (
    //     <ul>
    //         {todos?.map((todo, index) => (
    //             <li key={`todo-${index}`}>{todo}</li>
    //         ))}
    //     </ul>
    // )
    return (<>Standings</>)
}