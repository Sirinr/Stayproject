import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import type {BookingsData} from "./typesBookings"
import { 
fetchBookings,
addBookingApi,
editBookingApi,
deleteBookingApi, 
} from "./apiBookings"

let bookings: BookingsData[] = []
let currentEditBookingId: number | null = null

type RoomData = {
  id: number
  name: string
  pricePrNight: number
  description: string
  features: string []
  image: string
}
let rooms: RoomData [] = []

async function fetchRooms () {
  const response= await fetch ("http://localhost:3000/api/rooms")
  if (!response.ok) {
    throw new Error (`Failed to fetch rooms ${response.status}`)
  }

  const data: RoomData[] = await response.json()
  return data
}

async function displayBookings() {
  renderMyBookingsPage()

const bookingData = await fetchBookings ()
const RoomData = await fetchRooms ()

if (bookingData) {
  bookings=bookingData
  }
rooms = RoomData

    renderMyBookingsPage()
  }

displayBookings();

async function deleteBooking(id: number) {
  await deleteBookingApi (id)
  
  bookings = bookings.filter((booking) => booking.id !== id)
  renderMyBookingsPage()
}

async function addBooking(event: Event) {
  event.preventDefault()

  const roomIdInput = document.querySelector<HTMLInputElement>(".room-id-input")
  const fromDateInput = document.querySelector<HTMLInputElement>(".from-date-input")
  const toDateInput = document.querySelector<HTMLInputElement>(".to-date-input")
  const messageInput = document.querySelector<HTMLInputElement>(".message-input")

  if (!roomIdInput || !fromDateInput || !toDateInput || !messageInput) return

  const bookingData = {
  userId: 1,
  roomId: Number(roomIdInput.value),
  fromDate: fromDateInput.value,
  toDate: toDateInput.value,
  status: "pending",
  message: messageInput.value,
  updated: new Date().toISOString(),
}

if (currentEditBookingId !== null) {
  const updatedBooking = await editBookingApi(
    currentEditBookingId,
    bookingData
  )

  if (updatedBooking) {
    bookings = bookings.map((booking) => {
      if (booking.id === currentEditBookingId) {
        return updatedBooking
      }

      return booking
    })
  }

  currentEditBookingId = null
} else {
  const newBooking: BookingsData = {
    id: Date.now(),
    ...bookingData,
    created: new Date().toISOString(),
  }

  const savedBooking = await addBookingApi(newBooking)

  if (savedBooking) {
    bookings.push(savedBooking)
  }
  }
  renderMyBookingsPage()
  
}

function editBooking(id: number) {
  const editTheBooking = bookings.find(
    (booking) => booking.id === id
  )

  if (!editTheBooking) return

  currentEditBookingId = id

  const editOverlay = document.querySelector(".booking-form-overlay")

  const roomIdInput =
    document.querySelector<HTMLInputElement>(".room-id-input")

  const fromDateInput =
    document.querySelector<HTMLInputElement>(".from-date-input")

  const toDateInput =
    document.querySelector<HTMLInputElement>(".to-date-input")

  const messageInput =
    document.querySelector<HTMLInputElement>(".message-input")

  if (
    !roomIdInput ||
    !fromDateInput ||
    !toDateInput ||
    !messageInput
  ) return

  roomIdInput.value = String(editTheBooking.roomId)
  fromDateInput.value = editTheBooking.fromDate
  toDateInput.value = editTheBooking.toDate
  messageInput.value = editTheBooking.message

  editOverlay?.classList.remove("hidden")
}

function addEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn")

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"))
      deleteBooking(id)
    })
  })

  const editButtons = document.querySelectorAll(".edit-btn")

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"))
      editBooking(id)
    })
  })

  
const openFormButton = document.querySelector(".open-booking-form-btn")
const closeFormButton = document.querySelector(".close-booking-form-btn")
const formOverlay = document.querySelector(".booking-form-overlay")

openFormButton?.addEventListener("click", () => {
  formOverlay?.classList.remove("hidden")
})

closeFormButton?.addEventListener("click", () => {
  formOverlay?.classList.add("hidden")
})

  const addForm = document.querySelector<HTMLFormElement>(".add-booking-form")

  if (addForm) {
    addForm.addEventListener("submit", addBooking)
  }
 }

export function MyBookingsPage() {
  const activeBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "confirmed"
  )

  const pastBookings = bookings.filter(
    (booking) => 
      booking.status === "expired"  ||
    booking.status === "cancelled"
  )

  return `
    ${Header()}
    <main>
      <section class="my-bookings-section container">
        <div class="my-bookings-section__header">
          <h1 class="my-bookings-section__title">My Bookings</h1>
        </div>

        <h2 class="my-bookings-section__subtitle">Active</h2>

<div class="my-bookings-section__add">
<button class="open-booking-form-btn" type="button">+ Add booking</button>
</div>

<div class="booking-form-overlay hidden">
<div class="booking-form-box">
<button class="close-booking-form-btn" type="button">x</button>

<h2> Add booking </h2>

<form class= "add-booking-form">
<label>
Room ID
<input class="room-id-input" type="number" required />
</label>

<label>
Check-in
<input class="from-date-input" type="date" required/>
</label>

<label>
Checkout
<input class="to-date-input" type="date" required/>
</label>

<label>
Message
<input class="message-input" type="text" placeholder="Message"/>
</label>

<button class="add-booking-btn" type="submit">
Save booking</button>
          </form>
        </div>
        </div>

        ${activeBookings
          .map((booking) => {
            const room =rooms.find((room)=> room.id === booking.roomId)
            return `
          <article class="booking-card" data-id="${booking.id}">
            <div class="booking-card__image"></div>

            <div class="booking-card__content">
              <div class="booking-card__top">
                <h3 class="booking-card__title">${room?.name || `Room ${booking.roomId}`}</h3>
                <button class="booking-card__icon edit-btn" data-id="${booking.id}" type="button">Edit</button>
              </div>
              <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
              <p class="booking-card__status">${booking.status}</p>
              <p class="booking-card__message">${booking.message}</p>
              <p class="booking-card__total">${room?.pricePrNight || 0} NOK per night</p>
            </div>

            <div class="booking-card__actions">
              <button class="booking-card__button delete-btn" data-id="${booking.id}" type="button">
                ✕ Cancel
              </button>
            </div>
          </article>
        `
          })
          .join("")}

        <h2 class="my-bookings-section__subtitle">Past</h2>

        ${pastBookings
          .map((booking) => {
              const room= rooms.find((room) => room.id === booking.roomId)

              return `
          <article class="booking-card" data-id="${booking.id}">
            <div class="booking-card__image"></div>

            <div class="booking-card__content">
              <h3 class="booking-card__title">${room?.name || `Room ${booking.roomId}`}</h3>
              <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
              <p class="booking-card__status">${booking.status}</p>
              <p class="booking-card__message">${booking.message}</p>
             <p class="booking-card__total">${room?.pricePrNight || 0} NOK per night</p>
            </div>

            <div class="booking-card__actions">
              <button class="booking-card__button" type="button">See details</button>
            </div>
          </article>
        `
         })
          .join("")}

        <div class="rooms-section__more">
          <button class="btn-main rooms-section__more-button" type="button">
            See more
          </button>
        </div>
      </section>
    </main>
    ${Footer()}
  `
}

export function renderMyBookingsPage() {
  const app = document.querySelector<HTMLDivElement>("#app")

  if (!app) return

  app.innerHTML = MyBookingsPage()
  addEventListeners()
}

