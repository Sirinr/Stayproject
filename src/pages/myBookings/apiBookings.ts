/*Sirin Rosøy*/

import type { BookingsData } from "./typesBookings";
const apiKey: string = "Stayproject1"
const bookingApi = "http://localhost:3000/api/bookings"

/*read*/

export async function fetchBookings () { 
    try { 
        const response: Response = await fetch ("http://localhost:3000/api/bookings");       

  if (!response.ok) { 
    throw new Error (`Failed to fetch bookings ${response.status}`)
  }
const data: BookingsData[] = await response.json ();
return data;    
} catch (error) {
    throw error;
}
 }

/*create*/
export async function addBookingApi(bookingData: {
userId: number
  roomId: number
  fromDate: string
  toDate: string
  status: string
  message: string
  created: string
  updated: string
   }) {
try {
  const response: Response = await fetch ("http://localhost:3000/api/bookings", {
 method: "POST",
headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
 body: JSON.stringify(bookingData),
    })

  if (!response.ok) {
    throw new Error(`Failed to add bookings ${response.status}`);
  }

  const data: BookingsData = await response.json();
  return data;
} catch (error) {
  throw error;
}
 }

/*Update*/

export async function editBookingApi(id:number, updatedBooking: Partial<BookingsData>) {
try {
  const response: Response = await fetch(`${bookingApi}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(updatedBooking)
  });

  if (!response.ok) {
    throw new Error(`Failed to edit booking ${response.status}`)
  }
   

  const data: BookingsData = await response.json();
  return data;
} catch (error) {
  throw error;
}
}
 
/*Delete*/

export async function deleteBookingApi(id:number) {
try {
  const response: Response = await fetch(`${bookingApi}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to delete booking ${response.status}`)
  } else {
    
    return;
  }
} catch (error) {
  throw error;
} 
}