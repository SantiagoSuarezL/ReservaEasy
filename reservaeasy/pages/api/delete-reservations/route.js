import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ error: 'id is required' })
    }

    const { data, error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)
    
    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.status(200).json(data)
}