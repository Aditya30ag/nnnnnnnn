package org.zenith.pay.demo.service;

import org.zenith.pay.demo.model.Hotel;
import org.zenith.pay.demo.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    // Fetch all hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
}
