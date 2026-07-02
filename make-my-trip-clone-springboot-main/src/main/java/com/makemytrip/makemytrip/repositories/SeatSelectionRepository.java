package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.SeatSelection;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SeatSelectionRepository extends MongoRepository<SeatSelection, String> {
    Optional<SeatSelection> findByFlightId(String flightId);
}