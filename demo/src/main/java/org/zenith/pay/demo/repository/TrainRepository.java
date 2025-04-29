package org.zenith.pay.demo.repository;

import org.zenith.pay.demo.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
}
