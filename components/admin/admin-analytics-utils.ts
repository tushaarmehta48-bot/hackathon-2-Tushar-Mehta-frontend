import type { EventAnalyticsRow } from "@/lib/types/admin";

export function analyticsRows(
  analytics: EventAnalyticsRow | EventAnalyticsRow[],
): EventAnalyticsRow[] {
  return Array.isArray(analytics) ? analytics : [analytics];
}

export function aggregateAnalytics(rows: EventAnalyticsRow[]) {
  return rows.reduce(
    (acc, row) => ({
      sold: acc.sold + row.ticketsSold,
      remaining: acc.remaining + row.ticketsRemaining,
      checkedIn: acc.checkedIn + row.admissionsCheckedIn,
      revenue: acc.revenue + row.revenueMinor,
      bookings: acc.bookings + row.confirmedBookings,
      capacity: acc.capacity + row.capacity,
    }),
    { sold: 0, remaining: 0, checkedIn: 0, revenue: 0, bookings: 0, capacity: 0 },
  );
}

export function metricsFromRow(row: EventAnalyticsRow) {
  const total = row.ticketsSold + row.ticketsRemaining;
  return {
    sold: row.ticketsSold,
    remaining: row.ticketsRemaining,
    total,
    checkedIn: row.admissionsCheckedIn,
    checkInRate: row.checkInRate,
    revenue: row.revenueMinor,
    bookings: row.confirmedBookings,
    capacity: row.capacity,
    status: row.status,
    title: row.title,
  };
}
