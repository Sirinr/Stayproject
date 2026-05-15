// Tetiana Prokopova

type Room = {
  id: number
  name: string
  location: string
  pricePrNight: number
  image: string
  rating: number
}

const STORAGE_KEY = 'stayproject_rooms'

const defaultRooms: Room[] = [
  { id: 1, name: 'Mountain View Suite', location: 'Bergen, Norway', pricePrNight: 1200, image: '/images/room-1.jpg', rating: 4.5 },
  { id: 2, name: 'City Center Loft', location: 'Oslo, Norway', pricePrNight: 1800, image: '/images/room-2.jpg', rating: 4.0 },
  { id: 3, name: 'Seaside Retreat', location: 'Stavanger, Norway', pricePrNight: 2200, image: '/images/room-3.jpg', rating: 4.8 },
  { id: 4, name: 'Forest Cabin', location: 'Trondheim, Norway', pricePrNight: 900, image: '/images/room-4.jpg', rating: 3.5 },
  { id: 5, name: 'Harbor View Room', location: 'Ålesund, Norway', pricePrNight: 1500, image: '/images/room-5.jpg', rating: 4.2 },
  { id: 6, name: 'Fjord House', location: 'Tromsø, Norway', pricePrNight: 2800, image: '/images/room-6.jpg', rating: 4.9 },
]

function loadRooms(): Room[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms))
  return defaultRooms
}

function saveRooms(rooms: Room[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export function getRooms(): Promise<Room[]> {
  return Promise.resolve(loadRooms())
}

export function addRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
  const rooms = loadRooms()
  const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1
  const newRoom: Room = { id: newId, ...roomData }
  saveRooms([...rooms, newRoom])
  return Promise.resolve(newRoom)
}

export function deleteRoom(roomId: number): Promise<boolean> {
  saveRooms(loadRooms().filter(r => r.id !== roomId))
  return Promise.resolve(true)
}

export function updateRoom(roomId: number, roomData: Partial<Omit<Room, 'id'>>): Promise<Room> {
  const rooms = loadRooms()
  const index = rooms.findIndex(r => r.id === roomId)
  if (index === -1) throw new Error('Room not found')
  rooms[index] = { ...rooms[index], ...roomData }
  saveRooms(rooms)
  return Promise.resolve(rooms[index])
}
