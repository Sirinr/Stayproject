import { Header } from "../../components/header"
import { Footer } from "../../components/footer"

export function LoginPage() {
  return `
    ${Header()}

    <main class="login-page">
      <section class="login-section">
        <div class="login-card">
          <div class="login-card__form-side">
            <div class="login-icon-box"></div>

            <h1 class="login-title">Sign in</h1>

            <p class="login-role-text">
            Guest <span>|</span> Host
          </p>
    

            <form class="login-form">
              <div class="login-field">
                <label for="username-input">Username</label>
                <input
                  type="text"
                  id="username-input"
                  name="username"
                  placeholder="Enter your username"
                />
              </div>

              <div class="login-field">
                <label for="password-input">Password</label>
                <input
                  type="password"
                  id="password-input"
                  name="password"
                  placeholder="Enter your password"
                />
              </div>

              <button type="button" class="login-button">Sign in</button>
            </form>

            <button id="open-register" class="login-link-button" type="button">
              Create account
            </button>
          </div>

          <div class="login-card__image-side">
            <div class="login-image-box"></div>
          </div>
        </div>
      </section>

      <section id="register-overlay" class="register-overlay hidden">
        <div class="register-box">
          <div class="login-icon-box"></div>

          <h2 class="register-title">Create an account</h2>

          <p class="login-role-text">
            Guest <span>|</span> Host
          </p>

          <form class="register-form">
            <div class="login-field">
              <label for="full-name-input">Full name</label>
              <input
                type="text"
                id="full-name-input"
                name="Fullname"
                placeholder="Your name"
              />
            </div>

             <div class="login-field">
        <label for="email-input">Your email</label>
        <input
          type="email"
          id="email-input"
          placeholder="yourmail@gmail.no"
        />
      </div>

            <div class="login-field">
              <label for="register-password-input">Password</label>
              <input
                type="password"
                id="register-password-input"
                name="password"
                placeholder="Choose a password"
              />
            </div>

            <div class="login-field">
        <label for="confirm-password-input">Confirm password</label>
        <input
          type="password"
          id="confirm-password-input"
          placeholder="Confirm password"
        />
      </div>

            <button type="button" class="login-button">Create</button>
          </form>

          <button id="close-register" class="login-link-button" type="button">
            Back to login
          </button>
        </div>
      </section>
    </main>

    ${Footer()}
  `
}

export function setupLoginPage() {
  const openRegisterButton = document.getElementById("open-register")
  const closeRegisterButton = document.getElementById("close-register")
  const registerOverlay = document.getElementById("register-overlay")

  openRegisterButton?.addEventListener("click", () => {
    registerOverlay?.classList.remove("hidden")
  })

  closeRegisterButton?.addEventListener("click", () => {
    registerOverlay?.classList.add("hidden")
  })
}