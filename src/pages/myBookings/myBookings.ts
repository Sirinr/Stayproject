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

async function displayBookings() {
  renderMyBookingsPage()

  const data = await fetchBookings()
  console.log(data)

  if (data) {
    bookings = data
    renderMyBookingsPage()
  }
}

displayBookings();

async function deleteBooking(id: number) {
  await deleteBookingApi (id)
  
  bookings = bookings.filter((booking) => booking.id !== id)
  renderMyBookingsPage()
}

async function addBooking() {
  const newBooking: BookingsData = {
    id: Date.now(),
    userId: 1,
    roomId: 4,
    fromDate: "2026-03-01",
    toDate: "2026-03-05",
    status: "pending",
    message: "",
    created: "",
    updated: "",
  }

  const savedBooking = await addBookingApi(newBooking)

  if (savedBooking)  {
    bookings.push(savedBooking)
    renderMyBookingsPage ()
}
}

async function editBooking(id: number) {
  const editTheBooking = bookings.find ((booking) => booking.id === id)

if (!editTheBooking) return

const newBookingStatus =
editTheBooking.status === "pending" ? "confirmed" : "pending"

const updatedBooking = await editBookingApi (id, {
  status: newBookingStatus,
})

if (updatedBooking) {
  bookings = bookings.map((booking) => {
    if (booking.id === id) {
      return updatedBooking
      }
      
    return booking
  })

  renderMyBookingsPage()
}
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

  const addForm = document.querySelector<HTMLFormElement(".add-booking-form")

  if (addForm) {
    addForm.addEventListener("submit", addBooking)
  }
}

export function MyBookingsPage() {
  const activeBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "confirmed"
  )

  const pastBookings = bookings.filter(
    (booking) => booking.status === "expired"
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
<form class= "add-booking-form">
<input class="room-id" type="number" placeholder:"Room id"/>
<input class="from-date" type="date"/>
<input class="to-date" type="date"/>
<input class="message-input" type="text" placeholder="Message"/>
          <button class="add-booking-btn" type="submit">+ Add booking</button>
          </form>
        </div>

        ${activeBookings
          .map(
            (booking) => `
          <article class="booking-card" data-id="${booking.id}">
            <div class="booking-card__image"></div>

            <div class="booking-card__content">
              <div class="booking-card__top">
                <h3 class="booking-card__title">Room ${booking.roomId}</h3>
                <button class="booking-card__icon edit-btn" data-id="${booking.id}" type="button">✎</button>
              </div>

              <p class="booking-card__location">Location</p>
              <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
              <p class="booking-card__status">${booking.status}</p>
              <p class="booking-card__total">$ 0,000 total</p>
            </div>

            <div class="booking-card__actions">
              <button class="booking-card__button delete-btn" data-id="${booking.id}" type="button">
                ✕ Cancel
              </button>
            </div>
          </article>
        `
          )
          .join("")}

        <h2 class="my-bookings-section__subtitle">Past</h2>

        ${pastBookings
          .map(
            (booking) => `
          <article class="booking-card" data-id="${booking.id}">
            <div class="booking-card__image"></div>

            <div class="booking-card__content">
              <h3 class="booking-card__title">Room ${booking.roomId}</h3>
              <p class="booking-card__location">Location</p>
              <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
              <p class="booking-card__status">${booking.status}</p>
              <p class="booking-card__total">$ 0,000 total</p>
            </div>

            <div class="booking-card__actions">
              <button class="booking-card__button" type="button">See details</button>
            </div>
          </article>
        `
          )
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

