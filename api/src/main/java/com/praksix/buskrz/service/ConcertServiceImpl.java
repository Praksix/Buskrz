package com.praksix.buskrz.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Concert;
import com.praksix.buskrz.model.Lieu;
import com.praksix.buskrz.repository.ConcertRepository;
import com.praksix.buskrz.repository.LieuRepository;

@Service
public class ConcertServiceImpl implements ConcertService {

    @Autowired
    ConcertRepository repository;

    @Autowired
    LieuRepository lieuRepository;

    @Override
    public void createConcert(Concert concert) {
        concert.setStatus("PENDING");
        repository.save(concert);
    }

    @Override
    public void updateConcert(Concert concert) {
        repository.save(concert);
    }

    @Override
    public Collection<Concert> getConcerts() {
        return repository.findAll();
    }

    @Override
    public void deleteConcert(String id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAllConcerts() {
        repository.deleteAll();
    }

    @Override
    public Optional<Concert> getConcertById(String id) {
        return repository.findById(id);
    }

    @Override
    public Collection<Concert> getConcertsByArtisteId(String artisteId) {
        return repository.findAllByArtisteIdsContaining(artisteId);
    }

    @Override
    public Collection<Concert> getConcertsByCity(String city) {
        List<Concert> concertsInCity = new ArrayList<>();

        // Récupérer tous les lieux de la ville
        List<Lieu> lieuxInCity = lieuRepository.findAllByCity(city);

        // Pour chaque lieu, récupérer tous les concerts
        for (Lieu lieu : lieuxInCity) {
            List<Concert> concertsInLieu = repository.findAllByLieuId(lieu.getId());
            // Filtrer les concerts PENDING
            for (Concert concert : concertsInLieu) {
                if (!"PENDING".equals(concert.getStatus())) {
                    concertsInCity.add(concert);
                }
            }
        }

        return concertsInCity;
    }

    @Override
    public Collection<Concert> getConcertsByLieuId(String lieuId) {
        return repository.findAllByLieuId(lieuId);
    }

    @Override
    public Collection<Concert> getConcertsByStatus(String status) {
        return repository.getConcertsByStatus(status);
    }

}
