package com.praksix.buskrz.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.praksix.buskrz.model.Concert;

@Repository
public interface ConcertRepository extends MongoRepository<Concert, String> {
    
    // Méthodes personnalisées basées sur les propriétés du modèle Artiste
    public Concert findByArtisteIdsContaining(String artisteId);
    public List<Concert> findAllByArtisteIdsContaining(String artisteId);
    public List<Concert> findAllByLieuId(String lieuId);
    public List<Concert> findAllByDate(String date);

    public List<Concert> getConcertsByStatus(String status);

}
