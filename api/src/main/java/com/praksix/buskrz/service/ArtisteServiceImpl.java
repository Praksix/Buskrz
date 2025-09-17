package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Artiste;
import com.praksix.buskrz.repository.ArtisteRepository;

@Service
public class ArtisteServiceImpl implements ArtisteService {
    
    @Autowired
    ArtisteRepository repository;

    @Override
    public void createArtiste(Artiste artiste) {
        repository.save(artiste);
    }

    @Override
    public void updateArtiste(Artiste artiste) {
        repository.save(artiste);
    }

    @Override
    public Collection<Artiste> getArtistes() {
        return repository.findAll();
    }

    @Override
    public void deleteArtiste(String id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAllArtistes() {
        repository.deleteAll();
    }

    @Override
    public Optional<Artiste> getArtisteById(String id) {
        return repository.findById(id);
    }
}
