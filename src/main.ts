import "./styles/base.css"
import "./styles/components.css"
import "./styles/pages.css"
import { MyBookingsPage } from "./pages/myBookings/myBookings"

const app = document.querySelector("#app")

if (app) {
  app.innerHTML = MyBookingsPage()
}