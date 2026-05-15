//Johanne Sausgard
import { Header } from "../../components/header";

const headerContainer = document.getElementById("header");
if (headerContainer) {
  headerContainer.innerHTML = Header();
}

import { SearchBar } from "../../components/searchBar";
const searchBarContainer = document.getElementById("search-bar");
if (searchBarContainer) {
  searchBarContainer.innerHTML = SearchBar();
}

import { Footer } from "../../components/footer";

const footerContainer = document.getElementById("footer");
if (footerContainer) {
  footerContainer.innerHTML = Footer();
}

//Dette er en "regelbok" for hvordan review skal se ut. Nå vet TS at review skal inneholde disse dataene.
type Review = {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  created: string;
  updated: string;
};

type Room = {
  id: number;
  name: string;
  pricePrNight: number;
  maxGuests: number;
  description: string;
  features: string[];
  reviews: Review[];
};

//Alle disse er konstanter som blir hentet frem i funksjonen nedenfor, og som også kan gjenbrukes utenfor den ene funksjonen
const roomTitle = document.getElementById("room-title");
const roomPrice = document.getElementById("room-price");
const roomMaxGuests = document.getElementById("room-max-guests");
const roomDescription = document.getElementById("room-description");
const roomFeatures = document.getElementById("room-features");
const reviewsContainer = document.getElementById("reviews-container");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");
const reviewSubmitBtn = document.getElementById("review-submit-btn");
const reviewForm = document.getElementById("review-form");
const reviewRating = document.getElementById("review-rating");
const reviewComment = document.getElementById("review-comment");

const params = new URLSearchParams(window.location.search);
const roomId = params.get("id");
const API_BASE_URL = "http://localhost:3000/api"; //I stedet for å skrive inn url flere ganger, kan jeg enkelt hente den herfra.
const apiKey = "Gruppe13";

let currentRoom: Room | null = null; //currentRoom er enten typen Room ELLER null
let editingReviewId: number | null = null; //editingReviewId er enten typen number ELLER null

function renderStars(rating: number) {
  return "⭐️".repeat(rating);
}

function formateDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("no-NO");
}

function showSpinner() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "block";
  }
}

function hideSpinner() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "none";
  }
}

//Bruker if fordi dette er en sikkerhetssjekk, hvis elementet finnes bruk det.
//Finner HTML elementet med samme id, og setter setter teksten lik det som er lagret i APIet.
function renderRoom(room: Room) {
  if (roomTitle) {
    roomTitle.textContent = room.name;
  }

  if (roomPrice) {
    roomPrice.textContent = `${room.pricePrNight} kr. per natt`;
  }
  if (roomMaxGuests) {
    roomMaxGuests.textContent = `Maks ${room.maxGuests} gjester`;
  }
  if (roomDescription) {
    roomDescription.textContent = room.description;
  }
}

function renderFeatures(features: string[]) {
  if (!roomFeatures) return;
  roomFeatures.innerHTML = ""; //hvis fetchRooms() kjøres flere ganger, kan man få problemer med fuplikater. Derfor "tømmes" containeren før det settes inn noe.

  features.forEach((feature: string) => {
    //går gjennom hver feature i arrayet
    const li = document.createElement("li"); //lager et nytt listepunkt
    li.textContent = feature; //setter inn teksten fra APIet, men vises enda ikke på siden
    roomFeatures.appendChild(li); //appendChild betyr å legge et HTML-element inn i et annet HTML-element
  });
}

function renderReviews(reviews: Review[]) {
  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = "";

  if (reviews.length === 0) {
    reviewsContainer.textContent = "No reviews for this place yet";
    return;
  }

  reviews.forEach((review: Review) => {
    const reviewCard = renderReviewCard(review);
    reviewsContainer.appendChild(reviewCard);
  });
}

function renderReviewCard(review: Review) {
  const reviewCard = document.createElement("div");
  reviewCard.classList.add("card");

  reviewCard.innerHTML = `
    <p>${renderStars(review.rating)}</p>
    <p>Publisert: ${formateDate(review.created)}</p>
    <p>${review.comment}</p>
    <button class="delete-review-btn">Delete</button>
    <button class="edit-review-btn">Edit</button>
    `;

  const deleteBtn = reviewCard.querySelector(".delete-review-btn");
  deleteBtn?.addEventListener("click", async () => {
    if (!currentRoom) return;

    const filteredReviews = currentRoom.reviews.filter(
      (currentReview: Review) => currentReview.id !== review.id,
    );

    await saveReviews(filteredReviews);
  });

  const editBtn = reviewCard.querySelector(".edit-review-btn");
  editBtn?.addEventListener("click", () => {
    startEditReview(review);
  });

  return reviewCard;
}

function startEditReview(review: Review) {
  editingReviewId = review.id;

  (reviewRating as HTMLSelectElement).value = review.rating.toString();
  (reviewComment as HTMLTextAreaElement).value = review.comment;

  if (reviewSubmitBtn) {
    reviewSubmitBtn.textContent = "Send";
  }
}

async function saveReviews(updatedReviews: Review[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        reviews: updatedReviews,
      }),
    });

    if (!response.ok) {
      throw new Error(`The API returned an error code: ${response.status}`);
    }

    const updatedRoom = await response.json();

    currentRoom = updatedRoom;

    editingReviewId = null;

    (reviewRating as HTMLSelectElement).value = "";
    (reviewComment as HTMLTextAreaElement).value = "";

    if (reviewSubmitBtn) {
      reviewSubmitBtn.textContent = "Review submitted";
    }

    fetchRooms();
  } catch (error) {
    hideSpinner();
    console.error(error);

    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Noe gikk galt ved lagring av anmeldelsen";
    }
  }
}

//API-kall tar tid, derfor må det være async og await for at koden skal kjøre riktig.
async function fetchRooms() {
  //vis "Laster rom" frem til siden er ferdig lastet
  showSpinner();

  //Prøv å laste inn data fra API
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`); //Hent rooms fra APIet, men vent til API svarer. ${} kalles tempalte literal, kan bruke variabler i tekst
    if (!response.ok) {
      throw new Error("Kunne ikke hente rom.");
    }

    const room: Room = await response.json(); //gjør API svaret om til JavaScript-data, altså et objekt som kan brukes.
    currentRoom = room; //her er en variabel begge kan bruke, og ikke bare inne i fetchRooms()

    hideSpinner();

    renderRoom(room);

    renderFeatures(room.features);

    renderReviews(room.reviews);
  } catch (error) {
    hideSpinner();
    if (errorMessage) {
      errorMessage.textContent = "noe gikk galt ved henting av rom.";
    }

    console.log(error);
  }
}

fetchRooms();

if (reviewForm) {
  //Når review-skjemaet sendes inn gjør dette...
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault(); //ikke refresh siden

    const rating = (reviewRating as HTMLSelectElement).value; //as HTMLSelectElement sier "behandle dette som et select-element, sånn at jeg kan hente value"
    const comment = (reviewComment as HTMLTextAreaElement).value; //as HTMLTextAreaElement sier "behandle dette som et text-element"

    //alt som skal skje når brukeren trykker submit, må stå inne i addEventListner-funksjonen

    if (!rating || !comment) {
      //denne betyr at hvis rating eller comment mangler, så skal funksjonen stoppes og sender ut en melding.

      if (errorMessage) {
        errorMessage.style.display = "block"; //viser kun meldingen om ikke alle feltene er fylt ut
        errorMessage.textContent =
          "You need to choose how many stars and wrtite a review for this place.";

        setTimeout(() => {
          //Denne gjør at popupen forsvinner etter 5 sekunder
          if (errorMessage) {
            errorMessage.style.display = "none";
          }
        }, 5000);
      }

      return;
    }

    const newReview = {
      id: Date.now(),
      userId: 1,
      rating: Number(rating),
      comment: comment,
      created: new Date().toISOString(), //toISOString brukes for å få et bestemt format på datoen som overføres til APIet
      updated: new Date().toISOString(),
    };

    alert("Review submitted");

    let updatedReviews: Review[]; //Dette er en tom variabel
    if (editingReviewId !== null) {
      if (!currentRoom) return;
      //map() går gjennom alle reviews
      updatedReviews = currentRoom.reviews.map((review: Review) => {
        //Dette betyr "fant reviewet som skal redigeres"
        if (review.id === editingReviewId) {
          //behold alt gammelt, men oppdater rating/comment
          return {
            ...review,
            rating: Number(rating),
            comment: comment,
            updated: new Date().toISOString(),
          };
        }
        return review; //Alle andre reviews skal være uendret
      });
    } else {
      if (!currentRoom) return;
      //Dette betyr at hvis vi ikke redigerer en anmeldelse, skal det lages en ny.
      updatedReviews = [...currentRoom.reviews, newReview];
    }

    await saveReviews(updatedReviews);
  });
}

const bookingForm = document.getElementById("booking-form");
const checkInInput = document.querySelector(".check-in");
const checkOutInput = document.querySelector(".check-out");
const guestNumberInput = document.querySelector(".guest-number");
const inquiryInput = document.getElementById("booking-inquiry");

function getBookingFormData() {
  return {
    fromDate: (checkInInput as HTMLInputElement).value,
    toDate: (checkOutInput as HTMLInputElement).value,
    guests: (guestNumberInput as HTMLInputElement).value,
    message: (inquiryInput as HTMLTextAreaElement).value,
  };
}

function validateBooking(
  fromDate: string,
  toDate: string,
  guests: string,
  message: string,
) {
  if (!fromDate || !toDate || !guests || !message) {
    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent =
        "Du må fylle ut dato, antall gjester og skrive en forespørsel.";
    }

    return false;
  }

  if (!roomId) {
    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Fant ikke rom-id";
    }

    return false;
  }

  return true;
}

async function createBooking() {
  const { fromDate, toDate, guests, message } = getBookingFormData();

  const isValid = validateBooking(fromDate, toDate, guests, message);

  if (!isValid) return;

  const newBooking = {
    id: Date.now(),
    userId: 1, //her ville det ikke stått 1, men den hadde hentet userId fra brukeren som er logget inn. Evt spørr Sirirn om hva userId blir lagret som i localStorage!
    roomId: Number(roomId),
    fromDate,
    toDate,
    status: "pending",
    message,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(newBooking),
  });

  if (!response.ok) {
    throw new Error(`The API returned an error code: ${response.status}`);
  }

  await response.json();

  resetBookingForm();

  alert("Request submitted!");
}

function resetBookingForm() {
  (checkInInput as HTMLInputElement).value = "";
  (checkOutInput as HTMLInputElement).value = "";
  (guestNumberInput as HTMLInputElement).value = "";
  (inquiryInput as HTMLInputElement).value = "";
}

async function handleBookingSubmit(event: SubmitEvent) {
  event.preventDefault();

  try {
    await createBooking();
  } catch (error) {
    console.error(error);

    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent =
        "Something went wrong whit submitting your request.";
    }
  }
}

if (bookingForm) {
  bookingForm.addEventListener("submit", handleBookingSubmit);
}
