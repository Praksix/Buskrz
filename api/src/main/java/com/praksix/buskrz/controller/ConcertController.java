package com.praksix.buskrz.controller;

import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.praksix.buskrz.model.Concert;
import com.praksix.buskrz.service.ConcertService;

@RestController
@RequestMapping("/api/v1/concerts")
public class ConcertController {

    @Autowired
    ConcertService concertService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<Concert> getConcerts() {
        return concertService.getConcerts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createConcert(@Valid @RequestBody Concert concert) {
        concertService.createConcert(concert);
    }

    @GetMapping("/{id}")
    public Optional<Concert> getConcertById(@PathVariable String id) {
        return concertService.getConcertById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateConcert(@PathVariable String id, @Valid @RequestBody Concert concert) {
        // pas d'utilisation de l'id dans le body?
        concertService.updateConcert(concert);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteConcert(@PathVariable String id) {
        concertService.deleteConcert(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.OK)
    public void deleteAllConcert() { 
        concertService.deleteAllConcerts();
    }

    @GetMapping("/artiste/{artisteId}")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Concert> getConcertsByArtisteId(@PathVariable String artisteId) {
        return concertService.getConcertsByArtisteId(artisteId);
    }

    @GetMapping("/city/{city}")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Concert> getConcertsByCity(@PathVariable String city) {
        return concertService.getConcertsByCity(city);
    }

    @GetMapping("/lieu/{lieuId}")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Concert> getConcertsByLieuId(@PathVariable String lieuId) {
        return concertService.getConcertsByLieuId(lieuId);
    }

    @GetMapping("/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Concert> getConcertsByStatus(@PathVariable String status) {
        return concertService.getConcertsByStatus(status);
    }

    @PutMapping("/{id}/validate")
    @ResponseStatus(HttpStatus.OK)
    public void validateConcert(@PathVariable String id) {
        concertService.validateConcert(id);
    }

}
