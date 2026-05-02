// Tetiana Prokopova

import { RoomCard } from '../../components/roomCard'
import { getRooms, addRoom, deleteRoom, updateRoom } from '../../api/rooms'

type ApiRoom = {
  id: number
  name: string
  location: string
  pricePrNight: number
  image: string
  rating: number
}

function attachRoomsListeners() {
  // Add room button
  const addButton = document.querySelector('.rooms-section__add')
  if (addButton) {
    addButton.addEventListener('click', async () => {
      const name = prompt('Enter room name:')
      if (!name) return

      const location = prompt('Enter location:')
      if (!location) return

      const priceStr = prompt('Enter price per night:')
      const pricePrNight = parseFloat(priceStr || '0')
      if (isNaN(pricePrNight)) return

      const image = prompt('Enter image URL:')
      if (!image) return

      const ratingStr = prompt('Enter rating (0-5):')
      const rating = parseFloat(ratingStr || '0')
      if (isNaN(rating) || rating < 0 || rating > 5) return

      try {
        await addRoom({ name, location, pricePrNight, image, rating })
        ;(window as any).renderApp()
      } catch (error) {
        alert('Failed to add room: ' + (error as Error).message)
      }
    })
  }

  // Edit buttons
  document.querySelectorAll('.room-card__edit').forEach(button => {
    button.addEventListener('click', async (e) => {
      const roomId = parseInt((e.currentTarget as HTMLElement).dataset.roomId || '0')
      if (!roomId) return

      const name = prompt('Enter new room name:')
      if (!name) return

      const location = prompt('Enter new location:')
      if (!location) return

      const priceStr = prompt('Enter new price per night:')
      const pricePrNight = parseFloat(priceStr || '0')
      if (isNaN(pricePrNight)) return

      const image = prompt('Enter new image URL:')
      if (!image) return

      const ratingStr = prompt('Enter new rating (0-5):')
      const rating = parseFloat(ratingStr || '0')
      if (isNaN(rating) || rating < 0 || rating > 5) return

      try {
        await updateRoom(roomId, { name, location, pricePrNight, image, rating })
        ;(window as any).renderApp()
      } catch (error) {
        alert('Failed to update room: ' + (error as Error).message)
      }
    })
  })

  // Delete buttons
  document.querySelectorAll('.room-card__delete').forEach(button => {
    button.addEventListener('click', async (e) => {
      const roomId = parseInt((e.currentTarget as HTMLElement).dataset.roomId || '0')
      if (!roomId) return

      if (!confirm('Are you sure you want to delete this room?')) return

      try {
        await deleteRoom(roomId)
        ;(window as any).renderApp()
      } catch (error) {
        alert('Failed to delete room: ' + (error as Error).message)
      }
    })
  })
}

export async function RoomsPage() {
  const rooms: ApiRoom[] = await getRooms()

  console.log('ROOMS:', rooms)

  const roomsCards = rooms
    .map((room) => {
      const rating = `${room.rating}/5`
      
      return RoomCard({
        image: room.image,
        title: room.name,
        location: room.location,
        rating: rating,
        price: `${room.pricePrNight} NOK`,
        isBooked: false,
        roomId: room.id
      })
    })
    .join('')

  const html = `
    <section class="rooms-section container">
      <div class="rooms-section__header">
        <h1 class="rooms-section__title">Rooms</h1>

        <div class="rooms-section__tabs">
          <button class="rooms-section__tab rooms-section__tab--active" type="button">Guest</button>
          <span class="rooms-section__divider">|</span>
          <button class="rooms-section__tab" type="button">Host</button>
        </div>

        <button class="rooms-section__add" type="button">
          Add room
          <img src="/icons/icon-plus.svg" alt="">
        </button>
      </div>

      <div class="rooms-grid">
        ${roomsCards}
      </div>

      <div class="rooms-section__more">
        <button class="btn-main rooms-section__more-button" type="button">
          See more
        </button>
      </div>
    </section>
  `

  return {
    html,
    attachListeners: () => attachRoomsListeners()
  }
}