import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'

import { Header } from './components/header'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { RoomsPage } from './pages/rooms/rooms'

const app = document.querySelector<HTMLDivElement>('#app')

async function renderApp() {
  if (!app) return

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
}

;(window as any).renderApp = renderApp

renderApp()