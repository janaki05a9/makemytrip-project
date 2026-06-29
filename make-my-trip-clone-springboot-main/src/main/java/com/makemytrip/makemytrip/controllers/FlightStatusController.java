package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.FlightStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight-status")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{flightId}")
    public ResponseEntity<?> getStatus(@PathVariable String flightId,
                                       @RequestParam(defaultValue = "Unknown") String flightName) {
        return flightStatusService.getFlightStatus(flightId, flightName);
    }
}