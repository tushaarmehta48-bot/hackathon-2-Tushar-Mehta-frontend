export type BookingLineItem = {
  packageId: string;
  packageName: string;
  priceMinor: number;
  admissionCount: number;
  quantity: number;
  lineTotalMinor: number;
};

export type BookingSummary = {
  id: string;
  reference: string;
  eventId: string;
  bookingDate?: string | null;
  items: BookingLineItem[];
  totalMinor: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TicketPublic = {
  id: string;
  ticketCode: string;
  qrToken: string;
  eventId: string;
  packageId: string;
  status: string;
  bookingDate?: string | null;
  checkedInAt?: string | null;
  admissionsTotal?: number;
  admissionsUsed?: number;
  admissionsRemaining?: number;
};

export type BookingQuote = {
  eventId: string;
  bookingDate?: string | null;
  items: Array<{
    packageId: string;
    packageName: string;
    priceMinor: number;
    admissionCount: number;
    quantity: number;
    lineTotalMinor: number;
  }>;
  totalMinor: number;
};

export type BookingRequest = {
  eventId: string;
  bookingDate?: string;
  items: Array<{ packageId: string; quantity: number }>;
};

