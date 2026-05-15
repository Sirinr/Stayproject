// Tetiana Prokopova

const API_BASE_URL = 'http://localhost:3000/api'
const apiKey: string = import.meta.env.VITE_API_KEY

export type Room = {
  id: number
  name: string
  location: string
  pricePrNight: number
  image: string
  rating: number
}

export async function getRooms(): Promise<Room[]> {
  const response = await fetch(`${API_BASE_URL}/rooms`)
  if (!response.ok) throw new Error(`Failed to fetch rooms: ${response.status}`)
  return response.json()
}

export async function addRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(roomData),
  })
  if (!response.ok) throw new Error(`Failed to add room: ${response.status}`)
  return response.json()
}

export async function deleteRoom(roomId: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!response.ok) throw new Error(`Failed to delete room: ${response.status}`)
  return true
}

export async function updateRoom(roomId: number, roomData: Partial<Omit<Room, 'id'>>): Promise<Room> {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(roomData),
  })
  if (!response.ok) throw new Error(`Failed to update room: ${response.status}`)
  return response.json()
}
