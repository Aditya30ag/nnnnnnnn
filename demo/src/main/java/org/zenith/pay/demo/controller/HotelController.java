package org.zenith.pay.demo.controller;
    
import org.zenith.pay.demo.model.Hotel;
import org.zenith.pay.demo.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")  // Consider restricting this in production for security purposes
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // Endpoint to fetch all hotels
    @GetMapping("/hotels")
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }
}
