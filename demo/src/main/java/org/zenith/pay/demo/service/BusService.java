package org.zenith.pay.demo.service;

import org.zenith.pay.demo.model.Bus;

import java.util.List;

public interface BusService {
    List<Bus> getAllBuses();
    Bus addBus(Bus bus);
    Bus getBusById(Long id);
    void deleteBus(Long id);
    Bus updateBus(Long id, Bus updatedBus);
}
