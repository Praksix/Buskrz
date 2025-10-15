package com.praksix.buskrz.service;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
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

    @Override
    public Artiste findOrCreateArtiste(String name, String genre) {
        // Chercher si l'artiste existe déjà
        Artiste existingArtiste = repository.findByName(name);
        
        if (existingArtiste != null) {
            // L'artiste existe : ajouter le genre s'il n'est pas déjà présent
            if (genre != null && !genre.trim().isEmpty() && !existingArtiste.getGenres().contains(genre)) {
                existingArtiste.addGenre(genre);
                repository.save(existingArtiste);
            }
            return existingArtiste;
        } else {
            // L'artiste n'existe pas : le créer
            List<String> genres = new ArrayList<>();
            if (genre != null && !genre.trim().isEmpty()) {
                genres.add(genre);
            }
            
            Artiste newArtiste = new Artiste(null, name, genres);
            return repository.save(newArtiste);
        }
    }
}
