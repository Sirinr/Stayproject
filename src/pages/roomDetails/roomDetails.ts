//Johanne Sausgard
import { Header } from "../../components/header";
const headerContainer = document.getElementById("header");
if (headerContainer) {
  headerContainer.innerHTML = Header();
}

import { Footer } from "../../components/footer";
const footerContainer = document.getElementById("footer");
if (footerContainer) {
  footerContainer.innerHTML = Footer();
}

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
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

const roomTitle = document.getElementById("room-title");
const roomPrice = document.getElementById("room-price");
const roomMaxGuests = document.getElementById("room-max-guests");
const roomDescription = document.getElementById("room-description");
const roomFeatures = document.getElementById("room-features");

const reviewsContainer = document.getElementById("reviews-container");
const reviewSubmitBtn = document.getElementById("review-submit-btn");
const reviewForm = document.getElementById("review-form");
const reviewRating = document.getElementById("review-rating");
const reviewComment = document.getElementById("review-comment");

const bookingForm = document.getElementById("booking-form");
const checkInInput = document.querySelector(".check-in");
const checkOutInput = document.querySelector(".check-out");
const guestNumberInput = document.querySelector(".guest-number");
const inquiryInput = document.getElementById("booking-inquiry");

const params = new URLSearchParams(window.location.search);
const roomId = params.get("id");

const API_BASE_URL = "http://localhost:3000/api";
const apiKey = "Gruppe13";

let currentRoom: Room | null = null;
let editingReviewId: number | null = null;

function renderStars(rating: number) {
  return "⭐️".repeat(rating);
}

function formatDate(dateString: string) {
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
  roomFeatures.innerHTML = "";

  features.forEach((feature: string) => {
    const li = document.createElement("li");
    li.textContent = feature;
    roomFeatures.appendChild(li);
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
    <p>Publisert: ${formatDate(review.created)}</p>
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

    const updatedRoom: Room = await response.json();

    currentRoom = updatedRoom;

    editingReviewId = null;

    (reviewRating as HTMLSelectElement).value = "";
    (reviewComment as HTMLTextAreaElement).value = "";

    if (reviewSubmitBtn) {
      reviewSubmitBtn.textContent = "send";
    }

    fetchRooms();
  } catch (error) {
    hideSpinner();
    console.error(error);

    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Something went wrong with saving your review";
    }
  }
}

async function fetchRooms() {
  showSpinner();

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error("Could not get room");
    }

    const room: Room = await response.json();
    currentRoom = room;

    renderRoom(room);
    renderFeatures(room.features);
    renderReviews(room.reviews);

    hideSpinner();
  } catch (error) {
    hideSpinner();
    if (errorMessage) {
      errorMessage.textContent = "Something went wrong while fetching the room";
    }

    console.error(error);
  }
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const rating = (reviewRating as HTMLSelectElement).value;
    const comment = (reviewComment as HTMLTextAreaElement).value;

    if (!rating || !comment) {
      if (errorMessage) {
        errorMessage.style.display = "block";
        errorMessage.textContent =
          "You need to choose how many stars and write a review for this place.";

        setTimeout(() => {
          if (errorMessage) {
            errorMessage.style.display = "none";
          }
        }, 5000);
      }

      return;
    }

    const newReview: Review = {
      id: Date.now(),
      userId: 1,
      rating: Number(rating),
      comment: comment,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    alert("Review submitted");

    let updatedReviews: Review[];
    if (editingReviewId !== null) {
      if (!currentRoom) return;

      updatedReviews = currentRoom.reviews.map((review: Review) => {
        if (review.id === editingReviewId) {
          return {
            ...review,
            rating: Number(rating),
            comment: comment,
            updated: new Date().toISOString(),
          };
        }
        return review;
      });
    } else {
      if (!currentRoom) return;
      updatedReviews = [...currentRoom.reviews, newReview];
    }

    await saveReviews(updatedReviews);
  });
}

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
        "You must fill in the date, number of guests, and write a request";
    }

    return false;
  }

  if (!roomId) {
    if (errorMessage) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Could not find room-id";
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
    userId: 1,
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
  (inquiryInput as HTMLTextAreaElement).value = "";
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
        "Something went wrong with submitting your request.";
    }
  }
}

if (bookingForm) {
  bookingForm.addEventListener("submit", handleBookingSubmit);
}

fetchRooms();
