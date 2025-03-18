'use client'
import { useState, useEffect } from 'react'
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, IconButton, Toolbar, Typography, Tooltip, Checkbox
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function AdminPanel() {
    const [reservations, setReservations] = useState([])
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('date')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    useEffect(() => {
        async function fetchReservations() {
            const res = await fetch('/api/get-reservations/route')
            const data = await res.json()
            setReservations(data)
        }
        fetchReservations()
    }, [])

    async function deleteReservation(id) {
        const res = await fetch(`/api/delete-reservations/route?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (res.ok) {
            setReservations(reservations.filter((b) => b.id !== id))
            setSelected(selected.filter((s) => s !== id))
        }
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(reservations.map((n) => n.id))
        } else {
            setSelected([])
        }
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            )
        }
        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => setPage(newPage)
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '800px', margin: 'auto', mt: 4 }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
                        Reservations
                    </Typography>
                    {selected.length > 0 && (
                        <Tooltip title="Delete">
                            <IconButton onClick={() => selected.forEach(id => deleteReservation(id))}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < reservations.length}
                                        checked={reservations.length > 0 && selected.length === reservations.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((booking) => (
                                    <TableRow key={booking.id} selected={selected.indexOf(booking.id) !== -1}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selected.indexOf(booking.id) !== -1}
                                                onChange={(event) => handleClick(event, booking.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{booking.name}</TableCell>
                                        <TableCell>{booking.email}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                        <TableCell>{booking.time}</TableCell>
                                        <TableCell>{booking.phone}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => deleteReservation(booking.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={reservations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
