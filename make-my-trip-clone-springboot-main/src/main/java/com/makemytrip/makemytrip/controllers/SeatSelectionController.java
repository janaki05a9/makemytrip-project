package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.SeatSelectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seats")
public class SeatSelectionController {

    @Autowired
    private SeatSelectionService seatSelectionService;

    @GetMapping("/{flightId}")
    public ResponseEntity<?> getSeats(@PathVariable String flightId) {
        return seatSelectionService.getSeats(flightId);
    }

    @PostMapping("/{flightId}/book")
    public ResponseEntity<?> bookSeat(@PathVariable String flightId,
                                       @RequestParam String seatNumber) {
        return seatSelectionService.bookSeat(flightId, seatNumber);
    }
}