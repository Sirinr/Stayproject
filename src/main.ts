import "./styles/base.css"
import "./styles/components.css"
import "./styles/pages.css"
import { LoginPage, setupLoginPage } from "./pages/logIn/logIn"

const app = document.querySelector("#app")

if (app) {
  app.innerHTML = LoginPage()
  setupLoginPage()
}