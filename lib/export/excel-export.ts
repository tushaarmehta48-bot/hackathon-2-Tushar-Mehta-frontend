import type { AdminBookingReportRow } from "@/lib/types/admin";
import { formatMinor } from "@/lib/format/currency";

function escapeXml(str: string | number | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/**
 * Exports confirmed bookings to Microsoft Excel (.xls SpreadsheetML) format
 * with official EventPulse application branding and styling.
 */
export function exportBookingsToExcel(
  bookings: AdminBookingReportRow[],
  filterEventTitle?: string,
) {
  const appName = "EventPulse";
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString("en-IN");
  const filename = `${appName}_Confirmed_Bookings_${dateStr}.xls`;

  const totalTickets = bookings.reduce((sum, b) => sum + (b.ticketsCount || 1), 0);
  const totalRevenueMinor = bookings.reduce((sum, b) => sum + (b.totalMinor || 0), 0);
  const totalRevenueStr = formatMinor(totalRevenueMinor);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${appName} Confirmed Bookings Report</Title>
  <Author>${appName} Admin</Author>
  <Created>${now.toISOString()}</Created>
  <Company>${appName}</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="BrandTitle">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="18" ss:Color="#4F46E5"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="ReportHeader">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="13" ss:Color="#0F172A"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="MetaLabel">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="9" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="MetaValue">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="ColHeader">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="10" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#3730A3"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CenterCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="BoldCell">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="PriceCell">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Color="#059669"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusConfirmed">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A7F3D0"/>
   </Borders>
  </Style>
  <Style ss:ID="SummaryTotal">
   <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="11" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#CBD5E1"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#64748B"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Confirmed Bookings">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="110"/>
   <Column ss:Width="160"/>
   <Column ss:Width="190"/>
   <Column ss:Width="180"/>
   <Column ss:Width="180"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="150"/>
   <Column ss:Width="90"/>

   <!-- Branding Header -->
   <Row ss:Height="28">
    <Cell ss:MergeAcross="10" ss:StyleID="BrandTitle">
     <Data ss:Type="String">&#9679; ${appName} — Event Management Platform</Data>
    </Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:MergeAcross="10" ss:StyleID="ReportHeader">
     <Data ss:Type="String">CONFIRMED BOOKINGS REPORT</Data>
    </Cell>
   </Row>

   <!-- Report Metadata -->
   <Row ss:Height="18">
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Generated:</Data></Cell>
    <Cell ss:MergeAcross="3" ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(dateStr)} ${escapeXml(timeStr)}</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Event Filter:</Data></Cell>
    <Cell ss:MergeAcross="4" ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(filterEventTitle || "All Events")}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Bookings:</Data></Cell>
    <Cell ss:MergeAcross="3" ss:StyleID="MetaValue"><Data ss:Type="String">${bookings.length} confirmed</Data></Cell>
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Tickets:</Data></Cell>
    <Cell ss:MergeAcross="4" ss:StyleID="MetaValue"><Data ss:Type="String">${totalTickets} tickets</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Revenue:</Data></Cell>
    <Cell ss:MergeAcross="9" ss:StyleID="MetaValue"><Data ss:Type="String">${escapeXml(totalRevenueStr)}</Data></Cell>
   </Row>

   <!-- Empty Separator Row -->
   <Row ss:Height="10"/>

   <!-- Table Column Headers -->
   <Row ss:Height="26">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">#</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Booking Reference</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Customer Email</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Event Name</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Packages Booked</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Tickets (Qty)</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Admissions</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Price Paid</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Booking Date &amp; Time</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Status</Data></Cell>
   </Row>

   <!-- Data Rows -->
   ${bookings
     .map((b, idx) => {
       const packageSummary = (b.items || [])
         .map((i) => `${i.packageName} (x${i.quantity})`)
         .join(", ") || "Standard Ticket";
       const priceStr = formatMinor(b.totalMinor);
       const dateFormatted = formatDate(b.createdAt);

       return `<Row ss:Height="22">
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${idx + 1}</Data></Cell>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${escapeXml(b.reference)}</Data></Cell>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${escapeXml(b.userName)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(b.userEmail)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(b.eventTitle)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(packageSummary)}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${b.ticketsCount}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${b.admissionsTotal}</Data></Cell>
    <Cell ss:StyleID="PriceCell"><Data ss:Type="String">${escapeXml(priceStr)}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${escapeXml(dateFormatted)}</Data></Cell>
    <Cell ss:StyleID="StatusConfirmed"><Data ss:Type="String">${escapeXml(b.status.toUpperCase())}</Data></Cell>
   </Row>`;
     })
     .join("\n   ")}

   <!-- Summary Row -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="5" ss:StyleID="SummaryTotal"><Data ss:Type="String">Total (${bookings.length} bookings)</Data></Cell>
    <Cell ss:StyleID="SummaryTotal"><Data ss:Type="Number">${totalTickets}</Data></Cell>
    <Cell ss:StyleID="SummaryTotal"><Data ss:Type="Number">${bookings.reduce((sum, b) => sum + (b.admissionsTotal || 1), 0)}</Data></Cell>
    <Cell ss:StyleID="SummaryTotal"><Data ss:Type="String">${escapeXml(totalRevenueStr)}</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="SummaryTotal"><Data ss:Type="String"></Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  triggerBrowserDownload(blob, filename);
}

/**
 * Exports confirmed bookings to CSV format with UTF-8 BOM
 */
export function exportBookingsToCsv(
  bookings: AdminBookingReportRow[],
  filterEventTitle?: string,
) {
  const appName = "EventPulse";
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const filename = `${appName}_Confirmed_Bookings_${dateStr}.csv`;

  const headers = [
    "S.No",
    "Booking Reference",
    "Customer Name",
    "Customer Email",
    "Event Name",
    "Packages Booked",
    "Tickets (Qty)",
    "Admissions Total",
    "Price Paid",
    "Booking Date & Time",
    "Status",
  ];

  function escapeCsv(val: string | number | null | undefined): string {
    if (val == null) return "";
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const rows = bookings.map((b, idx) => {
    const packageSummary = (b.items || [])
      .map((i) => `${i.packageName} (x${i.quantity})`)
      .join("; ") || "Standard Ticket";
    return [
      idx + 1,
      escapeCsv(b.reference),
      escapeCsv(b.userName),
      escapeCsv(b.userEmail),
      escapeCsv(b.eventTitle),
      escapeCsv(packageSummary),
      b.ticketsCount,
      b.admissionsTotal,
      escapeCsv(formatMinor(b.totalMinor)),
      escapeCsv(formatDate(b.createdAt)),
      escapeCsv(b.status.toUpperCase()),
    ].join(",");
  });

  const metadata = [
    `# Application: ${appName}`,
    `# Report: Confirmed Bookings Report`,
    `# Generated On: ${now.toLocaleString("en-IN")}`,
    `# Filter: ${filterEventTitle || "All Events"}`,
    `# Total Bookings: ${bookings.length}`,
    "",
  ].join("\r\n");

  const csvContent = "\uFEFF" + metadata + headers.join(",") + "\r\n" + rows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerBrowserDownload(blob, filename);
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
