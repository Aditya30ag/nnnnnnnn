package org.zenith.pay.demo.repository;

import org.zenith.pay.demo.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
    // Custom queries can be added here if needed
}
