package com.praksix.buskrz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.praksix.buskrz.model.Lieu;

@Repository
public interface LieuRepository extends MongoRepository<Lieu, String> {
    
    /**
     * Trouve un lieu par sa ville
     * @param city la ville à rechercher
     * @return un Optional contenant le lieu trouvé ou vide
     */
    Optional<Lieu> findByCity(String city);
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Trouve tous les lieux d'une ville
     * @param city la ville à rechercher
     * @return une liste de tous les lieux de la ville
     */
    List<Lieu> findAllByCity(String city);
}
