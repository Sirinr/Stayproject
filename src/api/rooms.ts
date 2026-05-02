// Tetiana Prokopova

const API_KEY = import.meta.env.VITE_API_KEY as string

export async function getRooms() {
  const response = await fetch('http://localhost:3000/api/rooms')

  if (!response.ok) {
    throw new Error(`Failed to fetch rooms: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function addRoom(roomData: {
  name: string
  location: string
  pricePrNight: number
  image: string
  rating: number
}) {
  const response = await fetch('http://localhost:3000/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(roomData)
  })

  if (!response.ok) {
    throw new Error(`Failed to add room: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function deleteRoom(roomId: number) {
  const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to delete room: ${response.status}`)
  }

  return true
}

export async function updateRoom(roomId: number, roomData: {
  name?: string
  location?: string
  pricePrNight?: number
  image?: string
  rating?: number
}) {
  const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(roomData)
  })

  if (!response.ok) {
    throw new Error(`Failed to update room: ${response.status}`)
  }

  const data = await response.json()
  return data
}