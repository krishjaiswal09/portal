import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.devportal.artgharana.com";

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      transports: ['websocket'], // optional
    })
    setSocket(newSocket)

    const handleConnect = () => {
      console.log("Connected")
      setIsConnected(true)
      setConnectionError(null)
    }

    const handleDisconnect = () => {
      console.log("Disconnected")
      setIsConnected(false)
    }

    const handleError = (error: any) => {
      setConnectionError(error.message || 'Connection error')
    }

    newSocket.on('connect', handleConnect)
    newSocket.on('disconnect', handleDisconnect)
    newSocket.on('connect_error', handleError)
    newSocket.on('on_connected', handleConnect)

    return () => {
      // Cleanup listeners
      newSocket.off('connect', handleConnect)
      newSocket.off('disconnect', handleDisconnect)
      newSocket.off('connect_error', handleError)
      newSocket.off('on_connected', handleConnect)

      // Disconnect socket when component unmounts (route change)
      newSocket.disconnect()
      console.log("Socket disconnected due to route change")
    }
  }, [])

  return { isConnected, connectionError, socket }
}
