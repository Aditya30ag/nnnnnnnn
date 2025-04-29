package org.zenith.pay.demo.service;

import org.zenith.pay.demo.model.Bus;
import org.zenith.pay.demo.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusServiceImpl implements BusService {

    @Autowired
    private BusRepository busRepository;

    @Override
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @Override
    public Bus addBus(Bus bus) {
        return busRepository.save(bus);
    }

    @Override
    public Bus getBusById(Long id) {
        Optional<Bus> bus = busRepository.findById(id);
        return bus.orElse(null);  // Return null if bus not found
    }

    @Override
    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }

    @Override
    public Bus updateBus(Long id, Bus updatedBus) {
        if (busRepository.existsById(id)) {
            updatedBus.setId(id);
            return busRepository.save(updatedBus);
        }
        return null;  // Return null if bus not found
    }
}
