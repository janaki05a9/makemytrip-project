package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class FlightStatusService {

    @Autowired
    private FlightStatusRepository flightStatusRepository;

    String[] statuses = {"On Time", "Delayed", "Boarding", "Departed", "Landed"};
    String[] reasons = {"Weather conditions", "Technical issue", "Air traffic", "Crew delay", "None"};

    public ResponseEntity<?> getFlightStatus(String flightId, String flightName) {
        Optional<FlightStatus> existing = flightStatusRepository.findByFlightId(flightId);
        FlightStatus fs = existing.orElse(new FlightStatus());

        Random random = new Random();
        String status = statuses[random.nextInt(statuses.length)];
        int delayMinutes = status.equals("Delayed") ? (random.nextInt(4) + 1) * 15 : 0;
        String reason = status.equals("Delayed") ? reasons[random.nextInt(4)] : "None";

        fs.setFlightId(flightId);
        fs.setFlightName(flightName);
        fs.setStatus(status);
        fs.setDelayMinutes(delayMinutes);
        fs.setDelayReason(reason);
        fs.setOriginalDeparture("10:00 AM");
        fs.setRevisedDeparture(delayMinutes > 0 ? "10:" + delayMinutes + " AM" : "10:00 AM");
        fs.setEstimatedArrival(delayMinutes > 0 ? "12:" + delayMinutes + " PM" : "12:00 PM");
        fs.setGate("Gate " + (char)('A' + random.nextInt(6)) + (random.nextInt(9) + 1));
        fs.setLastUpdated(LocalDateTime.now().toString());

        flightStatusRepository.save(fs);
        return ResponseEntity.ok(fs);
    }
}
