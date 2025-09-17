package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Lieu;

@Service
public interface LieuService {
    
    public void createLieu(Lieu lieu);
    public void updateLieu(Lieu lieu);
    public Collection<Lieu> getLieux();
    public void deleteLieu(String id);
    public void deleteAllLieux();
    public Optional<Lieu> getLieuById(String id);
    public Optional<Lieu> getLieuByCity(String city);

    


}
