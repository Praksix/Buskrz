package com.praksix.buskrz.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.praksix.buskrz.model.Artiste;

@Repository
public interface ArtisteRepository extends MongoRepository<Artiste, String> {
    
    // Méthodes personnalisées basées sur les propriétés du modèle Artiste
    public Artiste findByName(String name);
    public List<Artiste> findByGenresContaining(String genre);
    public List<Artiste> findAll();

}
