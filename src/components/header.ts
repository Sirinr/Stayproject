// Tetiana Prokopova

export function Header() {
  return `
    <header class="header">
      <div class="container header__container">
        <a class="header__logo" href="#">
          <img src="/icons/logo.svg" alt="Stay logo" class="header__logo-image">
        </a>

        <nav class="header__nav">
          <a class="header__link" href="#">Rooms</a>
          <a href="#" class="header__link">My Bookings</a>
          <a href="#" class="header__link">Profile</a>
        </nav>
      </div>
    </header>
  `
}