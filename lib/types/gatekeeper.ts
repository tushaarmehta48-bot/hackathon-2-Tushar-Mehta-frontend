export type GatekeeperAssignment = {
  id: string;
  eventId: string;
  gateId?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  status: string;
  event?: {
    id: string;
    title: string;
    venue: string;
    startAt: string;
    endAt: string;
    status: string;
  };
};

export type CheckInResultType =
  | "success"
  | "already_used"
  | "invalid"
  | "cancelled"
  | "wrong_event"
  | "unauthorised";

export type CheckInResponse = {
  result: CheckInResultType;
  message: string;
  admittedCount?: number;
  ticket?: {
    id: string;
    ticketCode: string;
    eventId: string;
    status: string;
    checkedInAt?: string;
    admissionsTotal?: number;
    admissionsUsed?: number;
    admissionsRemaining?: number;
  };
};
