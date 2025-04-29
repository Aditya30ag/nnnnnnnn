package org.zenith.pay.demo.controller;

import org.zenith.pay.demo.model.Train;
import org.zenith.pay.demo.service.TrainService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // Allow frontend access
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @PostMapping
    public Train createTrain(@RequestBody Train train) {
        return trainService.saveTrain(train);
    }

    @GetMapping("/trains")
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }
}
