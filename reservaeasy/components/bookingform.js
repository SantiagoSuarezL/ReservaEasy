'use client'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useState } from 'react'

export default function BookingForm() {

    const [form, setForm] = useState({ name: '', email: '', date: '', time: '', phone: '' })
    const [message, setMessage] = useState('')
    const [countryCode, setCountryCode] = useState('+57')

    const countryCodes = [
        { code: '+57', country: 'Colombia' },
        { code: "+1", country: "USA" },
        { code: "+52", country: "México" },
        { code: "+34", country: "España" }
    ]

    const handlePhoneChange = (e) => {
        const phoneNumber = e.target.value.replace(/\D/g, '')
        setForm({ ...form, phone: `${countryCode}${phoneNumber}` })
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('Adding reservation...')

        const response = await fetch('/api/add-reservation', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        if (response.ok) {
            setMessage('Reservation added successfully!')
            setForm({ name: '', email: '', date: '', time: '', phone: '' })
        } else {
            setMessage('Error: '+ data.error)
        }
    }

    return (
        <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Book an appointment</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                    required
                />
                <div className='flex'>
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className='p-2 border rounded'
                    >
                        {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.country} ({country.code})
                            </option>
                        ))}
                    </select>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone.replace(countryCode, '')}
                        onChange={handlePhoneChange}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                <Stack direction="row" spacing={2}>
                    <Button onClick={handleSubmit} variant="contained" sx={{ flex: '100%' }}>Book</Button>
                </Stack>
            </form>
            {message && <p className="mt-2 text-center text-green-500">{message}</p>}
        </div>
    )

}