import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import { render } from './pages/myBookings/myBookings'

import { Header } from './components/header'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { MyBookingsPage } from './pages/myBookings/myBookings'

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  
  render ()
}