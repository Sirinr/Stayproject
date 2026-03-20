import { RoomCard } from '../../components/roomCard'

export function RoomsPage() {
  return `
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
        ${RoomCard({
          image: '/images/room-1.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: false
        })}

        ${RoomCard({
          image: '/images/room-2.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: false
        })}

        ${RoomCard({
          image: '/images/room-3.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: false
        })}

        ${RoomCard({
          image: '/images/room-4.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: false
        })}

        ${RoomCard({
          image: '/images/room-5.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: true
        })}

        ${RoomCard({
          image: '/images/room-6.jpg',
          title: 'The Name',
          location: 'Location',
          rating: 'Rating/Features',
          price: '$ Price',
          isBooked: false
        })}
      </div>

      <div class="rooms-section__more">
        <button class="btn-main rooms-section__more-button" type="button">
          See more
        </button>
      </div>
    </section>
  `
}