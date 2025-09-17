package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Lieu;
import com.praksix.buskrz.repository.LieuRepository;

@Service
public class LieuServiceImpl implements LieuService {
    
    @Autowired
    LieuRepository repository;

    @Override
    public void createLieu(Lieu lieu) {
        repository.save(lieu);
    }

    @Override
    public void updateLieu(Lieu lieu) {
        repository.save(lieu);
    }

    @Override
    public Collection<Lieu> getLieux() {
        return repository.findAll();
    }

    @Override
    public void deleteLieu(String id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAllLieux() {
        repository.deleteAll();
    }

    @Override
    public Optional<Lieu> getLieuById(String id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Lieu> getLieuByCity(String city) {
        return repository.findByCity(city);
    }
}
