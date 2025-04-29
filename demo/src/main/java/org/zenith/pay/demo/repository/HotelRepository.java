package org.zenith.pay.demo.repository;

import org.zenith.pay.demo.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByName(String name); // Custom query to find hotels by name
    List<Hotel> findByLocation(String location);
}
