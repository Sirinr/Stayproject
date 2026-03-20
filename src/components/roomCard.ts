// Tetiana Prokopova
type RoomCardProps = {
  image: string
  title: string
  location: string
  rating: string
  price: string
  isBooked?: boolean
}

export function RoomCard({
  image,
  title,
  location,
  rating,
  price,
  isBooked = false
}: RoomCardProps) {
  return `
    <article class="room-card ${isBooked ? 'room-card--booked' : ''}">
      <div class="room-card__image-wrapper">
        <img class="room-card__image" src="${image}" alt="${title}">

        ${
          isBooked
            ? `<div class="room-card__badge">Booked (Jan 22 - Jan 28)</div>`
            : ''
        }
      </div>

      <div class="room-card__content">
        <div class="room-card__top">
          <h3 class="room-card__title">${title}</h3>
          <button class="room-card__edit" type="button" aria-label="Edit room">
            <img src="/icons/icon-edit.svg" alt="">
          </button>
        </div>

        <p class="room-card__location">${location}</p>

        <p class="room-card__rating">
          <span class="room-card__star">★</span>
          ${rating}
        </p>

        <div class="room-card__bottom">
          <div class="room-card__price-block">
            <p class="room-card__price">${price}</p>
            <p class="room-card__price-note">per night</p>
          </div>

          <button class="btn-main room-card__button" type="button">
            View details
          </button>
        </div>
      </div>
    </article>
  `
}