package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.SeatSelection;
import com.makemytrip.makemytrip.repositories.SeatSelectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SeatSelectionService {

    @Autowired
    private SeatSelectionRepository seatSelectionRepository;

    public ResponseEntity<?> getSeats(String flightId) {
        Optional<SeatSelection> existing = seatSelectionRepository.findByFlightId(flightId);
        if (existing.isPresent()) return ResponseEntity.ok(existing.get());

        SeatSelection ss = new SeatSelection();
        ss.setFlightId(flightId);
        List<SeatSelection.Seat> seats = new ArrayList<>();

        String[] rows = {"A", "B", "C", "D", "E", "F"};
        for (int i = 1; i <= 10; i++) {
            for (String row : rows) {
                SeatSelection.Seat seat = new SeatSelection.Seat();
                seat.setSeatNumber(i + row);
                if (i <= 2) {
                    seat.setType("Business");
                    seat.setPrice(2000);
                } else if (i <= 5) {
                    seat.setType("Premium Economy");
                    seat.setPrice(1000);
                } else {
                    seat.setType("Economy");
                    seat.setPrice(500);
                }
                seat.setBooked(Math.random() < 0.3);
                seats.add(seat);
            }
        }
        ss.setSeats(seats);
        seatSelectionRepository.save(ss);
        return ResponseEntity.ok(ss);
    }

    public ResponseEntity<?> bookSeat(String flightId, String seatNumber) {
        Optional<SeatSelection> existing = seatSelectionRepository.findByFlightId(flightId);
        if (existing.isEmpty()) return ResponseEntity.badRequest().body("Flight not found");

        SeatSelection ss = existing.get();
        ss.getSeats().stream()
            .filter(s -> s.getSeatNumber().equals(seatNumber))
            .findFirst()
            .ifPresent(s -> s.setBooked(true));

        seatSelectionRepository.save(ss);
        return ResponseEntity.ok(ss);
    }
}