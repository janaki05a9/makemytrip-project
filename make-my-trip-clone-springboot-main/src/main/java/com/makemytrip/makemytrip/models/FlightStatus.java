package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "flightstatus")
public class FlightStatus {
    @Id
    private String id;
    private String flightId;
    private String flightName;
    private String status;
    private String delayReason;
    private int delayMinutes;
    private String originalDeparture;
    private String revisedDeparture;
    private String estimatedArrival;
    private String gate;
    private String lastUpdated;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getFlightName() { return flightName; }
    public void setFlightName(String flightName) { this.flightName = flightName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public int getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(int delayMinutes) { this.delayMinutes = delayMinutes; }
    public String getOriginalDeparture() { return originalDeparture; }
    public void setOriginalDeparture(String originalDeparture) { this.originalDeparture = originalDeparture; }
    public String getRevisedDeparture() { return revisedDeparture; }
    public void setRevisedDeparture(String revisedDeparture) { this.revisedDeparture = revisedDeparture; }
    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }
    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }
    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
