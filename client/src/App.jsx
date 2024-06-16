import React, { useEffect } from 'react'
import {io} from 'socket.io-client'

const App = () => {

    const socket = io('http://localhost:4000')

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected')
            console.log('Id:', socket.id)
        })

        //calling from emit
        socket.on('welcome', (data) => {
            console.log(data)
        })
    }
    , [])

  return (
    <div>App</div>
  )
}

export default App