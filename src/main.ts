import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'

import { Header } from './components/header'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { RoomsPage } from './pages/rooms/rooms'

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    ${Header()}

    <main>
      ${Hero()}
      ${RoomsPage()}
    </main>
    
    ${Footer()}
  `
}