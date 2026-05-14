// Tetiana Prokopova

import { RoomCard } from '../../components/roomCard'
import { getRooms, addRoom, deleteRoom, updateRoom } from '../../api/rooms'

const ROOM_IMAGES = [
  '/images/room-1.jpg',
  '/images/room-2.jpg',
  '/images/room-3.jpg',
  '/images/room-4.jpg',
  '/images/room-5.jpg',
  '/images/room-6.jpg',
  '/images/room-7.jpg',
  '/images/room-8.jpg',
  '/images/room-9.jpg',
  '/images/room-10.jpg',
  '/images/room-11.jpg',
  '/images/room-details-main.jpg',
  '/images/room-details-1.jpg',
  '/images/room-details-2.jpg',
  '/images/room-details-3.jpg',
  '/images/room-details-4.jpeg',
]

const IMAGE_GRID_VISIBLE = 6

type ApiRoom = {
  id: number
  name: string
  location: string
  pricePrNight: number
  image: string
  rating: number
}

function buildImageGrid(): string {
  const thumbs = ROOM_IMAGES.map((src, i) => `
    <img class="room-form-images__thumb${i >= IMAGE_GRID_VISIBLE ? ' room-form-images__thumb--hidden' : ''}" src="${src}" alt="Room image">
  `).join('')

  return `
    <div class="room-form-images__grid">${thumbs}</div>
    ${ROOM_IMAGES.length > IMAGE_GRID_VISIBLE ? `<button type="button" class="room-form-images__more-btn">See more</button>` : ''}
  `
}

function attachRoomsListeners(rooms: ApiRoom[]) {
  const roomFormOverlay = document.querySelector('.room-form-overlay')
  const roomForm = document.querySelector<HTMLFormElement>('#room-form')
  const addButton = document.querySelector('.rooms-section__add')
  const closeButton = document.querySelector('.room-form__close')
  const cancelButton = document.querySelector('.room-form__cancel')

  let selectedImageUrl = ''

  const resetImageGrid = (overlay: Element | null) => {
    overlay?.querySelectorAll<HTMLElement>('.room-form-images__thumb').forEach((thumb, i) => {
      thumb.classList.toggle('room-form-images__thumb--hidden', i >= IMAGE_GRID_VISIBLE)
      thumb.classList.remove('room-form-images__thumb--selected')
    })
    const btn = overlay?.querySelector<HTMLElement>('.room-form-images__more-btn')
    if (btn) btn.textContent = 'See more'
  }

  const lockScroll = () => { document.body.style.overflow = 'hidden' }
  const unlockScroll = () => { document.body.style.overflow = '' }

  const closeRoomForm = () => {
    roomFormOverlay?.classList.add('hidden')
    roomForm?.reset()
    selectedImageUrl = ''
    resetImageGrid(roomFormOverlay)
    unlockScroll()
  }

  document.querySelectorAll<HTMLElement>('.room-form-images__more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grid = btn.previousElementSibling as HTMLElement
      const isExpanded = btn.textContent?.trim() === 'See less'
      grid.querySelectorAll<HTMLElement>('.room-form-images__thumb').forEach((thumb, i) => {
        if (i >= IMAGE_GRID_VISIBLE) thumb.classList.toggle('room-form-images__thumb--hidden', isExpanded)
      })
      btn.textContent = isExpanded ? 'See more' : 'See less'
    })
  })

  addButton?.addEventListener('click', () => { roomFormOverlay?.classList.remove('hidden'); lockScroll() })
  closeButton?.addEventListener('click', () => closeRoomForm())
  cancelButton?.addEventListener('click', () => closeRoomForm())

  roomFormOverlay?.addEventListener('click', (event) => {
    if (event.target === roomFormOverlay) closeRoomForm()
  })

  document.querySelectorAll<HTMLElement>('.room-form-overlay .room-form-images__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.room-form-overlay .room-form-images__thumb')
        .forEach(t => t.classList.remove('room-form-images__thumb--selected'))
      thumb.classList.add('room-form-images__thumb--selected')
      selectedImageUrl = thumb.getAttribute('src') || ''
    })
  })

  roomForm?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(roomForm)
    const name = (formData.get('name') as string).trim()
    const location = (formData.get('location') as string).trim()
    const pricePrNight = parseFloat((formData.get('price') as string) || '0')
    const rating = parseFloat((formData.get('rating') as string) || '0')

    if (!name || !location || !selectedImageUrl || isNaN(pricePrNight) || isNaN(rating)) {
      alert('Please fill in all fields and select an image.')
      return
    }

    try {
      await addRoom({ name, location, pricePrNight, image: selectedImageUrl, rating })
      closeRoomForm()
      ;(window as any).renderApp()
    } catch (error) {
      alert('Failed to add room: ' + (error as Error).message)
    }
  })

  // Edit form
  const editFormOverlay = document.querySelector('.room-edit-form-overlay')
  const editForm = document.querySelector<HTMLFormElement>('#room-edit-form')

  let editSelectedImageUrl = ''
  let currentEditRoomId = 0

  const closeEditForm = () => {
    editFormOverlay?.classList.add('hidden')
    editForm?.reset()
    editSelectedImageUrl = ''
    currentEditRoomId = 0
    resetImageGrid(editFormOverlay)
    unlockScroll()
  }

  document.querySelector('.room-edit-form__close')?.addEventListener('click', () => closeEditForm())
  document.querySelector('.room-edit-form__cancel')?.addEventListener('click', () => closeEditForm())

  editFormOverlay?.addEventListener('click', (event) => {
    if (event.target === editFormOverlay) closeEditForm()
  })

  document.querySelectorAll<HTMLElement>('.room-edit-form-overlay .room-form-images__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.room-edit-form-overlay .room-form-images__thumb')
        .forEach(t => t.classList.remove('room-form-images__thumb--selected'))
      thumb.classList.add('room-form-images__thumb--selected')
      editSelectedImageUrl = thumb.getAttribute('src') || ''
    })
  })

  editForm?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(editForm)
    const name = (formData.get('name') as string).trim()
    const location = (formData.get('location') as string).trim()
    const pricePrNight = parseFloat((formData.get('price') as string) || '0')
    const rating = parseFloat((formData.get('rating') as string) || '0')

    if (!name || !location || !editSelectedImageUrl || isNaN(pricePrNight) || isNaN(rating)) {
      alert('Please fill in all fields and select an image.')
      return
    }

    try {
      await updateRoom(currentEditRoomId, { name, location, pricePrNight, image: editSelectedImageUrl, rating })
      closeEditForm()
      ;(window as any).renderApp()
    } catch (error) {
      alert('Failed to update room: ' + (error as Error).message)
    }
  })

  // Edit buttons
  document.querySelectorAll('.room-card__edit').forEach(button => {
    button.addEventListener('click', (e) => {
      const roomId = parseInt((e.currentTarget as HTMLElement).dataset.roomId || '0')
      if (!roomId) return

      const room = rooms.find(r => r.id === roomId)
      if (!room) return

      currentEditRoomId = roomId
      editSelectedImageUrl = room.image

      const nameInput = editForm?.querySelector<HTMLInputElement>('#edit-name')
      const locationInput = editForm?.querySelector<HTMLInputElement>('#edit-location')
      const ratingInput = editForm?.querySelector<HTMLInputElement>('#edit-rating')
      const priceInput = editForm?.querySelector<HTMLInputElement>('#edit-price')

      if (nameInput) nameInput.value = room.name
      if (locationInput) locationInput.value = room.location
      if (ratingInput) ratingInput.value = String(room.rating)
      if (priceInput) priceInput.value = String(room.pricePrNight)

      document.querySelectorAll<HTMLElement>('.room-edit-form-overlay .room-form-images__thumb').forEach(thumb => {
        thumb.classList.toggle('room-form-images__thumb--selected', thumb.getAttribute('src') === room.image)
      })

      editFormOverlay?.classList.remove('hidden')
      lockScroll()
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

  const roomsCards = rooms
    .map((room) =>
      RoomCard({
        image: room.image,
        title: room.name,
        location: room.location,
        rating: `${room.rating}/5`,
        price: `${room.pricePrNight} NOK`,
        isBooked: false,
        roomId: room.id
      })
    )
    .join('')

  const imageGrid = buildImageGrid()

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

      <div class="room-form-overlay hidden">
        <div class="room-form-modal">
          <div class="room-form-header">
            <h2 class="room-form-title">Create room</h2>
            <button type="button" class="room-form__close" aria-label="Close form">
              <img src="/icons/icon-close.svg" alt="Close">
            </button>
          </div>

          <div class="room-form-images">
            <label class="room-form__label">Select image</label>
            ${imageGrid}
          </div>

          <form class="room-form" id="room-form">
            <div class="room-form__group">
              <label class="room-form__label" for="name">Name / Title</label>
              <input class="room-form__input" id="name" name="name" type="text" placeholder="Name Name" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="location">Location</label>
              <input class="room-form__input" id="location" name="location" type="text" placeholder="Place" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="rating">Rating / Future</label>
              <input class="room-form__input" id="rating" name="rating" type="number" step="0.5" min="0" max="5" placeholder="4.5" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="price">Price per night</label>
              <input class="room-form__input" id="price" name="price" type="number" step="100" min="0" placeholder="0" required>
            </div>

            <div class="room-form__actions">
              <button type="button" class="btn-main btn-secondary room-form__cancel">Cancel</button>
              <button type="submit" class="btn-main room-form__submit">Create</button>
            </div>
          </form>
        </div>
      </div>

      <div class="room-edit-form-overlay hidden">
        <div class="room-form-modal">
          <div class="room-form-header">
            <h2 class="room-form-title">Edit room</h2>
            <button type="button" class="room-edit-form__close" aria-label="Close form">
              <img src="/icons/icon-close.svg" alt="Close">
            </button>
          </div>

          <div class="room-form-images">
            <label class="room-form__label">Select image</label>
            ${imageGrid}
          </div>

          <form class="room-form" id="room-edit-form">
            <div class="room-form__group">
              <label class="room-form__label" for="edit-name">Name / Title</label>
              <input class="room-form__input" id="edit-name" name="name" type="text" placeholder="Name Name" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="edit-location">Location</label>
              <input class="room-form__input" id="edit-location" name="location" type="text" placeholder="Place" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="edit-rating">Rating / Future</label>
              <input class="room-form__input" id="edit-rating" name="rating" type="number" step="0.5" min="0" max="5" placeholder="4.5" required>
            </div>

            <div class="room-form__group">
              <label class="room-form__label" for="edit-price">Price per night</label>
              <input class="room-form__input" id="edit-price" name="price" type="number" step="100" min="0" placeholder="0" required>
            </div>

            <div class="room-form__actions">
              <button type="button" class="btn-main btn-secondary room-edit-form__cancel">Cancel</button>
              <button type="submit" class="btn-main room-form__submit">Save</button>
            </div>
          </form>
        </div>
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
    attachListeners: () => attachRoomsListeners(rooms)
  }
}
