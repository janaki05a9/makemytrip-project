package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "seatselections")
public class SeatSelection {
    @Id
    private String id;
    private String flightId;
    private List<Seat> seats = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }

    public static class Seat {
        private String seatNumber;
        private String type;
        private double price;
        private boolean booked;

        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public boolean isBooked() { return booked; }
        public void setBooked(boolean booked) { this.booked = booked; }
    }
}