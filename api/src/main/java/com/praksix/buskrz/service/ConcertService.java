package com.praksix.buskrz.service;

import java.util.Collection;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Concert;

@Service
public interface ConcertService {

    public void createConcert(Concert concert);

    public void updateConcert(Concert concert);

    public Collection<Concert> getConcerts();

    public void deleteConcert(String id);

    public void deleteAllConcerts();

    public Optional<Concert> getConcertById(String id);

    public Collection<Concert> getConcertsByArtisteId(String artisteId);

    public Collection<Concert> getConcertsByCity(String city);

    public Collection<Concert> getConcertsByLieuId(String lieuId);

    public Collection<Concert> getConcertsByStatus(String status);

}
