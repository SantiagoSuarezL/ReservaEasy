import { supabase } from "@/lib/supabaseclient";

export default async function handler(req, res) {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .limit(10)
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    res.status(200).json(data)
}