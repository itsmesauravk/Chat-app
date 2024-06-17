import React, { useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import  {Button, Container, TextField, Typography} from '@mui/material'

const App = () => {

    const socket = useMemo(() => io('http://localhost:4000'), [])


    const [message, setMessage] = useState('')

    const handlerSubmit = (e) => {
        e.preventDefault()
        socket.emit('message', message)
        setMessage('')
    }

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected')
            console.log('Id:', socket.id)
        })

        //calling from emit
        socket.on('message', (data) => {
            console.log(data)
            
        })

        // listner for receive-message
        socket.on('receive-message', (data) => {
            console.log(data)
        })

        return () => {
            socket.disconnect()
        }
    }
    , [])

  return <Container maxWidth="sm">
    <Typography variant="h2" align="center" gutterBottom>
      Welcome to Socket.Io
    </Typography>

    <form onSubmit={handlerSubmit}>
      <TextField onChange={e => setMessage(e.target.value)} value={message}  id='outlined-basic' label='Message' variant='outlined' fullWidth />
      <Button type='submit' variant='contained' color='primary' fullWidth> Send </Button>

    </form>
  </Container>

}

export default App