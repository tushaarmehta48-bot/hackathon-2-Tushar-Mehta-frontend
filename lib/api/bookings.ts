import { apiClient } from "@/lib/api-client";
import type {
  BookingQuote,
  BookingRequest,
  BookingSummary,
  TicketPublic,
} from "@/lib/types/booking";

export async function quoteBooking(body: BookingRequest) {
  return apiClient<{ quote: BookingQuote }>("/bookings/quote", {
    method: "POST",
    body,
  });
}

export async function createBooking(body: BookingRequest) {
  return apiClient<{
    booking: BookingSummary;
    tickets: TicketPublic[];
  }>("/bookings", {
    method: "POST",
    body,
  });
}

export async function listMyBookings() {
  return apiClient<{ bookings: BookingSummary[] }>("/bookings/me", {
    cache: "no-store",
  });
}

export async function getBooking(id: string) {
  return apiClient<{ booking: BookingSummary }>(`/bookings/${id}`, {
    cache: "no-store",
  });
}

export async function getBookingTickets(id: string) {
  return apiClient<{ tickets: TicketPublic[] }>(`/bookings/${id}/tickets`, {
    cache: "no-store",
  });
}

export async function cancelBooking(id: string) {
  return apiClient<{ booking: BookingSummary }>(`/bookings/${id}/cancel`, {
    method: "POST",
  });
}
