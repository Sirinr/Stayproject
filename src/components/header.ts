// Tetiana Prokopova

export function Header() {
  const hash = window.location.hash || '#rooms'
  return `
    <header class="header">
      <div class="container header__container">
        <a class="header__logo" href="/#rooms">
          <img src="/icons/logo.svg" alt="Stay logo" class="header__logo-image">
        </a>

        <nav class="header__nav">
          <a class="header__link${hash === '#rooms' ? ' header__link--active' : ''}" href="/#rooms">Rooms</a>
          <a class="header__link${hash === '#my-bookings' ? ' header__link--active' : ''}" href="/#my-bookings">My Bookings</a>
          <a class="header__link${hash === '#profile' ? ' header__link--active' : ''}" href="/#profile">Profile</a>
        </nav>
      </div>
    </header>
  `
}