import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import 'flatpickr/dist/flatpickr.min.css'

import flatpickr from 'flatpickr'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { RoomsPage } from './pages/rooms/rooms'

const app = document.querySelector<HTMLDivElement>('#app')

async function renderApp() {
  if (!app) return

  app.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div></div>`

  try {
    const roomsPage = await RoomsPage()

    app.innerHTML = `
      ${Header()}

      <main>
        ${Hero()}
        ${roomsPage.html}
      </main>

      ${Footer()}
    `

    roomsPage.attachListeners()

    flatpickr('#dates', {
      mode: 'range',
      dateFormat: 'D, M j',
      minDate: 'today',
    })

    const directionInput = document.querySelector<HTMLInputElement>('#direction')

    document.querySelector('.search-bar')?.addEventListener('submit', (e) => {
      e.preventDefault()
      const query = directionInput?.value.toLowerCase().trim() ?? ''
      document.querySelectorAll<HTMLElement>('.room-card').forEach(card => {
        const location = card.querySelector('.room-card__location')?.textContent?.toLowerCase() ?? ''
        card.style.display = !query || location.includes(query) ? '' : 'none'
      })
    })

    const cards = document.querySelectorAll<HTMLElement>('.room-card')
    const seeMoreButton = document.querySelector<HTMLButtonElement>('.rooms-section__more-button')
    const VISIBLE_COUNT = 6

    cards.forEach((card, index) => {
      if (index >= VISIBLE_COUNT) card.style.display = 'none'
    })

    if (cards.length <= VISIBLE_COUNT && seeMoreButton) {
      seeMoreButton.style.display = 'none'
    }

    let expanded = false

    seeMoreButton?.addEventListener('click', () => {
      expanded = !expanded
      cards.forEach((card, index) => {
        if (index >= VISIBLE_COUNT) card.style.display = expanded ? '' : 'none'
      })
      if (seeMoreButton) seeMoreButton.textContent = expanded ? 'See less' : 'See more'
    })
  } catch (error) {
    app.innerHTML = `<div class="spinner-wrapper"><p>Failed to load. Check that the server is running.</p></div>`
  }
}

;(window as any).renderApp = renderApp

renderApp()