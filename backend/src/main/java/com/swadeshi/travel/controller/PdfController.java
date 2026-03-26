package com.swadeshi.travel.controller;

import com.swadeshi.travel.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    // GET /api/pdf/download/{bookingId}
    // Returns PDF as binary download
    @GetMapping("/download/{bookingId}")
    public ResponseEntity<byte[]> downloadItinerary(@PathVariable Long bookingId) {
        try {
            byte[] pdfBytes = pdfService.generateItineraryPdf(bookingId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "itinerary_" + bookingId + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
