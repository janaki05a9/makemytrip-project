package com.makemytrip.makemytrip.services;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Booking bookFlight(String userId, String flightId, int seats, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);
        if (usersOptional.isPresent() && flightOptional.isPresent()) {
            Users user = usersOptional.get();
            Flight flight = flightOptional.get();
            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                booking.setBookingStatus("confirmed");
                booking.setReservationDateTime(LocalDate.now().toString());

                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    public Booking bookhotel(String userId, String hotelId, int rooms, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if (usersOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = usersOptional.get();
            Hotel hotel = hotelOptional.get();
            if (hotel.getAvailableRooms() >= rooms) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);
                booking.setBookingStatus("confirmed");
                booking.setReservationDateTime(LocalDate.now().toString());

                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or hotel not found");
    }
 public ResponseEntity<?> getUserBookings(String userId) {
    Optional<Users> usersOptional = userRepository.findById(userId);
    if (usersOptional.isEmpty()) return ResponseEntity.badRequest().body("User not found");
    return ResponseEntity.ok(usersOptional.get().getBookings());
}  
public ResponseEntity<?> cancelBooking(String userId, String bookingId, String reason) {
    Optional<Users> usersOptional = userRepository.findById(userId);
    if (usersOptional.isEmpty()) return ResponseEntity.badRequest().body("User not found");

    Users user = usersOptional.get();
    Users.Booking target = null;

    for (Users.Booking b : user.getBookings()) {
        if (b.getBookingId().equals(bookingId) && b.getBookingStatus().equals("confirmed")) {
            target = b;
            break;
        }
    }

    if (target == null) return ResponseEntity.badRequest().body("Booking not found");

    LocalDateTime bookedAt = LocalDateTime.parse(target.getReservationDateTime());
    boolean within24hrs = LocalDateTime.now().isBefore(bookedAt.plusHours(24));
    double refund = within24hrs ? target.getTotalPrice() * 0.5 : 0.0;

    target.setBookingStatus("cancelled");
    target.setCancellationReason(reason);
    target.setRefundAmount(refund);
    target.setRefundStatus("pending");
    userRepository.save(user);

    Map<String, Object> res = new HashMap<>();
    res.put("refundAmount", refund);
    res.put("refundMessage", within24hrs ? "Refund of ₹" + (int)refund + " in 5-7 business days" : "No refund applicable");
    return ResponseEntity.ok(res);
}
}