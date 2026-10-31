import type { PublicEvent } from "@/lib/types/event";
import type { PackageAvailability } from "@/lib/types/event";
import type { SafeUser } from "@/lib/types/user";

export type AdminEvent = PublicEvent & {
  createdBy: string;
};

export type AdminPackage = {
  id: string;
  eventId: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  admissionCount: number;
  quantityTotal: number;
  quantitySold: number;
  saleStart?: string | null;
  saleEnd?: string | null;
  perUserLimit?: number | null;
  active: boolean;
};

export type EventAnalyticsRow = {
  eventId: string;
  title: string;
  status: string;
  capacity: number;
  ticketsSold: number;
  ticketsRemaining: number;
  admissionsCheckedIn: number;
  checkInRate: number;
  revenueMinor: number;
  confirmedBookings: number;
};

export type CheckInReportRow = {
  id: string;
  eventId: string;
  eventTitle?: string;
  userName?: string;
  userEmail?: string;
  gatekeeperId: string;
  gatekeeperName?: string | null;
  gateId?: string | null;
  result: string;
  timestamp: string;
  ticketCode?: string;
  ticketStatus?: string;
  admissionsTotal?: number;
  admissionsUsed?: number;
  bookingReference?: string;
};

export type GatekeeperAssignment = {
  id: string;
  gatekeeperId: string;
  eventId: string;
  gateId?: string | null;
  status: string;
};

export type AdminGatekeeperAssignmentRow = {
  id: string;
  eventId: string;
  gateId?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status: string;
  gatekeeper?: { id: string; name: string; email: string };
  event?: {
    id: string;
    title: string;
    venue: string;
    startAt: string;
    endAt: string;
    timezone?: string;
    status: string;
  };
};

export type AdminBookingReportRow = {
  id: string;
  reference: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketsCount: number;
  admissionsTotal: number;
  totalMinor: number;
  status: string;
  items: {
    packageName: string;
    quantity: number;
    priceMinor: number;
    admissionCount: number;
  }[];
  createdAt: string;
};

export type { SafeUser, PackageAvailability };
