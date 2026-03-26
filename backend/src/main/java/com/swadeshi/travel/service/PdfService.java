package com.swadeshi.travel.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.swadeshi.travel.dto.BookingSummaryResponse;
import com.swadeshi.travel.dto.PlaceDto;
import com.swadeshi.travel.entity.Booking;
import com.swadeshi.travel.entity.User;
import com.swadeshi.travel.repository.BookingRepository;
import com.swadeshi.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingService bookingService;

    // Generate PDF for a booking and return bytes
    public byte[] generateItineraryPdf(Long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        if (!"SUCCESS".equals(booking.getPaymentStatus())) {
            throw new RuntimeException("Payment not completed. Cannot generate PDF.");
        }

        User user = booking.getUser();
        BookingSummaryResponse summary = bookingService.getBookingById(bookingId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 50, 50, 60, 60);
        PdfWriter.getInstance(document, baos);

        document.open();

        // ---- Fonts ----
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, new BaseColor(0, 102, 51));
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.WHITE);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.BLACK);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.BLACK);

        // ---- Header Banner ----
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);
        PdfPCell headerCell = new PdfPCell(new Phrase("🇮🇳  SWADESHI TRAVEL - ITINERARY", titleFont));
        headerCell.setBackgroundColor(new BaseColor(0, 153, 76));
        headerCell.setPadding(15);
        headerCell.setBorder(Rectangle.NO_BORDER);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerTable.addCell(headerCell);
        document.add(headerTable);
        document.add(Chunk.NEWLINE);

        // ---- Booking Info Section ----
        addSectionTitle(document, "Booking Details", new BaseColor(0, 102, 51));

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setWidths(new float[]{1, 2});

        addTableRow(infoTable, "Traveler Name", user.getName(), boldFont, bodyFont);
        addTableRow(infoTable, "Email", user.getEmail(), boldFont, bodyFont);
        addTableRow(infoTable, "Booking ID", "#" + booking.getId(), boldFont, bodyFont);
        addTableRow(infoTable, "Destination", summary.getDestinationName(), boldFont, bodyFont);
        addTableRow(infoTable, "Travel Type", summary.getTravelType(), boldFont, bodyFont);
        addTableRow(infoTable, "Booking Date", summary.getBookingDate(), boldFont, bodyFont);
        addTableRow(infoTable, "Payment Status", summary.getPaymentStatus(), boldFont, bodyFont);
        document.add(infoTable);
        document.add(Chunk.NEWLINE);

        // ---- Selected Places Section ----
        addSectionTitle(document, "Selected Tourist Places", new BaseColor(0, 102, 51));

        PdfPTable placeTable = new PdfPTable(4);
        placeTable.setWidthPercentage(100);
        placeTable.setWidths(new float[]{3, 2, 2, 2});

        // Table Header Row
        String[] headers = {"Place Name", "Category", "Est. Cost (Rs.)", "Visit Time (hrs)"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(new BaseColor(0, 153, 76));
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            placeTable.addCell(cell);
        }

        // Table Rows
        boolean alternate = false;
        for (PlaceDto place : summary.getSelectedPlaces()) {
            BaseColor rowColor = alternate ? new BaseColor(230, 255, 230) : BaseColor.WHITE;
            addPlaceRow(placeTable, place.getName(), place.getCategory(),
                    String.format("%.0f", place.getEstimatedCost()),
                    String.format("%.1f", place.getVisitDurationHours()),
                    bodyFont, rowColor);
            alternate = !alternate;
        }
        document.add(placeTable);
        document.add(Chunk.NEWLINE);

        // ---- Summary Section ----
        addSectionTitle(document, "Trip Summary", new BaseColor(0, 102, 51));

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(60);
        summaryTable.setHorizontalAlignment(Element.ALIGN_LEFT);
        summaryTable.setWidths(new float[]{2, 2});

        addTableRow(summaryTable, "Total Places Selected",
                String.valueOf(summary.getSelectedPlaces().size()), boldFont, bodyFont);
        addTableRow(summaryTable, "Total Duration",
                summary.getTotalDurationHours() + " hours", boldFont, bodyFont);
        addTableRow(summaryTable, "Original Cost",
                "Rs. " + String.format("%.0f", summary.getOriginalCost() != null ? summary.getOriginalCost() : summary.getTotalCost()), boldFont, bodyFont);
        if (summary.getDiscountPercent() != null && summary.getDiscountPercent() > 0) {
            Font discountFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, new BaseColor(0, 153, 76));
            addTableRow(summaryTable, "Discount Applied",
                    summary.getDiscountPercent().intValue() + "% OFF  (-Rs. " + String.format("%.0f", summary.getDiscountAmount()) + ")", boldFont, discountFont);
        }
        addTableRow(summaryTable, "Final Amount",
                "Rs. " + String.format("%.0f", summary.getTotalCost()), boldFont, bodyFont);
        document.add(summaryTable);
        document.add(Chunk.NEWLINE);

        // ---- Footer ----
        Paragraph footer = new Paragraph(
            "Thank you for booking with Swadeshi Travel! Jai Hind! 🇮🇳",
            new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, new BaseColor(0, 102, 51))
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    private void addSectionTitle(Document doc, String title, BaseColor color) throws DocumentException {
        Font f = new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD, color);
        Paragraph p = new Paragraph(title, f);
        p.setSpacingBefore(5);
        p.setSpacingAfter(5);
        doc.add(p);
        doc.add(new LineSeparator(1, 100, color, Element.ALIGN_CENTER, -2));
        doc.add(Chunk.NEWLINE);
    }

    private void addTableRow(PdfPTable table, String label, String value,
                              Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setPadding(6);
        labelCell.setBackgroundColor(new BaseColor(240, 240, 240));

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "-", valueFont));
        valueCell.setPadding(6);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addPlaceRow(PdfPTable table, String name, String category,
                              String cost, String duration,
                              Font font, BaseColor bgColor) {
        String[] values = {name, category, cost, duration};
        for (String v : values) {
            PdfPCell cell = new PdfPCell(new Phrase(v != null ? v : "-", font));
            cell.setPadding(6);
            cell.setBackgroundColor(bgColor);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }
}
