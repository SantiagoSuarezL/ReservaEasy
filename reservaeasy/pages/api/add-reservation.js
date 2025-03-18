import { supabase } from "@/lib/supabaseclient";
import Twilio from "twilio";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    } 

    const { name, email, date, time, phone } = req.body

    if (!name || !email || !date || !time || !phone) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    const { data, error } = await supabase
        .from('reservations')
        .insert([
            { name, email, date, time, phone }
        ])
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    const client = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    )

    try {
        const message = await client.messages.create({
            body: `Reservation confirmed for ${name} on ${date} at ${time}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        console.log("Message SID:", message.sid);
    } catch (error) {
        console.error("Twilio Error:", error);
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data)
}