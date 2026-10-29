export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  bannerUrl?: string | null;
  cardImageUrls?: string[];
  heroImageUrl?: string | null;
  venue: string;
  address: string;
  startAt: string;
  endAt: string;
  timezone: string;
  capacity: number;
  status: string;
  listingBadge?: "live" | "upcoming" | null;
  perUserTicketLimit: number;
  cancellationPolicy?: string | null;
  refundPolicy?: string | null;
  instructions?: string | null;
};

export type PackageAvailability = {
  id: string;
  name: string;
  priceMinor: number;
  admissionCount: number;
  quantityTotal: number;
  quantitySold: number;
  quantityRemaining: number;
  active: boolean;
  onSale: boolean;
  saleStart?: string | null;
  saleEnd?: string | null;
};

export type EventAvailability = {
  eventId: string;
  eventStatus: string;
  packages: PackageAvailability[];
  summary: {
    ticketsRemaining: number;
    isSoldOut: boolean;
    eventCapacityRemaining: number;
  };
};
