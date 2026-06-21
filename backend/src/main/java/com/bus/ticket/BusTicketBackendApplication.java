package com.bus.ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BusTicketBackendApplication {

    private final List<BusRoute> routes = new ArrayList<>();
    private final List<Booking> bookings = new ArrayList<>();
    private int bookingIdCounter = 1;

    public BusTicketBackendApplication() {
        // Sample bus routes
        routes.add(new BusRoute(1, "Delhi", "Jaipur", "2026-06-25 08:00", "2026-06-25 14:00", 450, 40));
        routes.add(new BusRoute(2, "Mumbai", "Pune", "2026-06-25 09:30", "2026-06-25 13:30", 320, 35));
        routes.add(new BusRoute(3, "Bangalore", "Mysore", "2026-06-26 07:00", "2026-06-26 11:00", 280, 45));
        routes.add(new BusRoute(4, "Chennai", "Hyderabad", "2026-06-26 22:00", "2026-06-27 06:00", 650, 30));
    }

    @GetMapping("/routes")
    public List<BusRoute> getRoutes() {
        return routes;
    }

    @PostMapping("/book")
    public Booking bookTicket(@RequestBody BookingRequest request) {
        BusRoute route = routes.stream()
                .filter(r -> r.getId() == request.getRouteId())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Route not found"));

        if (route.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        Booking booking = new Booking(
                bookingIdCounter++,
                request.getPassengerName(),
                route.getId(),
                route.getFromCity() + " → " + route.getToCity(),
                request.getSeatNumber(),
                route.getPrice()
        );

        route.setAvailableSeats(route.getAvailableSeats() - 1);
        bookings.add(booking);
        return booking;
    }

    @GetMapping("/bookings")
    public List<Booking> getBookings() {
        return bookings;
    }

    public static void main(String[] args) {
        SpringApplication.run(BusTicketBackendApplication.class, args);
    }
}

// Models
class BusRoute {
    private int id;
    private String fromCity;
    private String toCity;
    private String departure;
    private String arrival;
    private int price;
    private int availableSeats;

    public BusRoute(int id, String fromCity, String toCity, String departure, String arrival, int price, int availableSeats) {
        this.id = id;
        this.fromCity = fromCity;
        this.toCity = toCity;
        this.departure = departure;
        this.arrival = arrival;
        this.price = price;
        this.availableSeats = availableSeats;
    }

    // Getters and Setters
    public int getId() { return id; }
    public String getFromCity() { return fromCity; }
    public String getToCity() { return toCity; }
    public String getDeparture() { return departure; }
    public String getArrival() { return arrival; }
    public int getPrice() { return price; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
}

class Booking {
    private int id;
    private String passengerName;
    private int routeId;
    private String route;
    private String seatNumber;
    private int price;

    public Booking(int id, String passengerName, int routeId, String route, String seatNumber, int price) {
        this.id = id;
        this.passengerName = passengerName;
        this.routeId = routeId;
        this.route = route;
        this.seatNumber = seatNumber;
        this.price = price;
    }

    // Getters
    public int getId() { return id; }
    public String getPassengerName() { return passengerName; }
    public String getRoute() { return route; }
    public String getSeatNumber() { return seatNumber; }
    public int getPrice() { return price; }
}

class BookingRequest {
    private int routeId;
    private String passengerName;
    private String seatNumber;

    // Getters and Setters
    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}