// Tetiana Prokopova
import { SearchBar } from "./searchBar"

export function Hero() {
  return `
    <section class="hero">

      <div class="hero__image">
        <img src="/images/hero.jpg" alt="Stay hero image">
      </div>

      <div class="hero__search">
        ${SearchBar()}
      </div>

    </section>
  `
}