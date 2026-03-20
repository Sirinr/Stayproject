// Tetiana Prokopova
export function SearchBar() {
  return `
    <div class="search-bar-wrapper">
      <form class="search-bar">
        <div class="search-bar__field">
          <label class="search-bar__label" for="direction">Direction</label>
          <div class="search-bar__control">
            <img class="search-bar__icon" src="/icons/icon-location.svg" alt="">
            <input
              class="search-bar__input"
              id="direction"
              type="text"
              placeholder="Where to?"
            >
          </div>
        </div>

        <div class="search-bar__field">
          <label class="search-bar__label" for="dates">Dates</label>
          <div class="search-bar__control">
            <img class="search-bar__icon" src="/icons/icon-calendar.svg" alt="">
            <input
              class="search-bar__input"
              id="dates"
              type="text"
              placeholder="Thu, Jan 22 - Wed, Jan 28"
            >
          </div>
        </div>

        <div class="search-bar__field">
          <label class="search-bar__label" for="travelers">Travelers</label>
          <div class="search-bar__control">
            <img class="search-bar__icon" src="/icons/icon-user.svg" alt="">
            <input
              class="search-bar__input"
              id="travelers"
              type="text"
              placeholder="2 travelers, 1 room"
            >
          </div>
        </div>

        <button class="btn-main search-bar__button" type="submit">
          Search
        </button>
      </form>
    </div>
  `
}