import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Button, Container, Stack, TextField, Typography } from '@mui/material'

const ChatPage = () => {

  const socket = useMemo(() => io('http://localhost:4000',{
    withCredentials: true
  }), [])

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const [messages, setMessages] = useState([])
  const [group, setGroup] = useState("")
  const [joined, setJoined] = useState('')

  const handlerSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room })
    setMessage('')
  }

  const handlerJoin = (e) => {
    e.preventDefault()
    socket.emit('join', group)
    setGroup('')
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id)
      console.log('Connected')
      console.log('Id:', socket.id)
    })

    // calling from emit
    socket.on('message', (data) => {
      console.log(data)
    })

    // listener for receive-message
    socket.on('receive-message', (data) => {
      console.log(data)
      setMessages(prevMessages => [...prevMessages, data])
    })

    // listener for joined
    socket.on('joined', (data) => {
      console.log(data)
      setJoined(data)
    })



    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" gutterBottom>
        Welcome to Socket.Io
      </Typography>

      <Typography variant="h5" align="center" gutterBottom>
        My Id : {socketId}
      </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        {joined}
      </Typography>

      <form onSubmit={handlerJoin}>
        <h5>Join Room</h5>
        <TextField onChange={e => setGroup(e.target.value)} value={group} id='outlined-basic' label='Group' variant='outlined' fullWidth />
        <Button type='submit' variant='contained' color='primary' fullWidth> Join </Button>

      </form>

      <form onSubmit={handlerSubmit}>
        <TextField onChange={e => setMessage(e.target.value)} value={message} id='outlined-basic' label='Message' variant='outlined' fullWidth />

        <TextField onChange={e => setRoom(e.target.value)} value={room} id='outlined-basic' label='Room' variant='outlined' fullWidth />

        <Button type='submit' variant='contained' color='primary' fullWidth> Send </Button>
      </form>

      <Stack spacing={2}>
        {messages.map((msg, index) => <Typography key={index} variant='h6' align='center'>{msg}</Typography>)}
      </Stack>
    </Container>
  )
}

export default ChatPage
