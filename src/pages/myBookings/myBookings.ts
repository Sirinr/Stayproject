import { Header } from "../../components/header"
import { Footer } from "../../components/footer"

let bookings = [
  {
    id: 1,
    roomId: 1,
    fromDate: '2026-01-11',
    toDate: '2026-01-12',
    status: 'Pending'
  },
  {
    id: 2,
    roomId: 2,
    fromDate: '2026-02-14',
    toDate: '2026-02-18',
    status: 'Confirmed'
  },
{
    id: 3,
    roomId: 3,
    fromDate: '2026-02-27',
    toDate: '2026-02-28',
    status: 'Expired'
  }
]

function deleteBooking(id: number) {
  bookings = bookings.filter((booking) => booking.id !== id)

  render()
}

function addBooking() {
  const newBooking = {
    id: Date.now(),
    roomId: 4,
    fromDate: '2026-03-01',
    toDate: '2026-03-05',
    status: 'Pending'
  }

  bookings.push(newBooking)

  render()
}

function editBooking(id: number) {
  bookings = bookings.map((booking) => {
    if (booking.id === id) {
      return {
        ...booking,
        status: booking.status === 'Pending' ? 'Confirmed' : 'Pending'
      }
    }

    return booking
  })

  render()
}

export function render() {
  const app = document.querySelector('#app')

  if (!app) return

  app.innerHTML = `
    ${Header()}
    <main>
      ${MyBookingsPage()}
    </main>
    ${Footer()}
  `

  addEventListeners()
}

function addEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn')

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.getAttribute('data-id'))
      deleteBooking(id)
    })
    })

    const editButtons = document.querySelectorAll('.edit-btn')

editButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = Number(button.getAttribute('data-id'))
    editBooking(id)
  })
})

  const addButton = document.querySelector('.add-booking-btn')

if (addButton) {
  addButton.addEventListener('click', addBooking)
}
}

export function MyBookingsPage() {

const activeBookings = bookings.filter(
    (booking) => booking.status === 'Pending' || booking.status === 'Confirmed'
)

const pastBookings = bookings.filter(
  (booking) => booking.status === 'Expired'
)

  return `
   <section class="my-bookings-section container">
  <div class="my-bookings-section__header">
    <h1 class="my-bookings-section__title">My Bookings</h1>
  </div>


<h2 class="my-bookings-section__subtitle"> Active </h2>

<div class="my-bookings-section__add">
        <button class="add-booking-btn" type="button">+ Add booking</button>
      </div>

${activeBookings.map((booking) => `
    <article class="booking-card" data-id="${booking.id}">
    <div class="booking-card__image"></div>

    <div class="booking-card__content">
    <div class="booking-card__top">
    <h3 class="booking-card__title">The name</h3>
    <button class="booking-card__icon edit-btn" data-id=${booking.id}">✎</button>
            </div>

    <p class="booking-card__location">Location</p>
            <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
            <p class="booking-card__status">${booking.status}</p>
            <p class="booking-card__total">$ 0,000 total</p>
          </div>

          <div class="booking-card__actions">
            <button class="booking-card__button delete-btn" data-id="${booking.id}">✕ Cancel</button>
          </div>
        </article>
      `).join('')}

      <h2 class="my-bookings-section__subtitle">Past</h2>

      ${pastBookings.map((booking) => `
        <article class="booking-card" data-id="${booking.id}">
          <div class="booking-card__image"></div>

          <div class="booking-card__content">
            <h3 class="booking-card__title">The name</h3>
            <p class="booking-card__location">Location</p>
            <p class="booking-card__dates">${booking.fromDate} - ${booking.toDate}</p>
            <p class="booking-card__status">${booking.status}</p>
            <p class="booking-card__total">$ 0,000 total</p>
          </div>

          <div class="booking-card__actions">
            <button class="booking-card__button" type="button">See details</button>
          </div>
        </article>
        

      `).join('')}

      <div class="rooms-section__more">
        <button class="btn-main rooms-section__more-button" type="button">
          See more
        </button>
      </div>
    </section>
  `

      
}