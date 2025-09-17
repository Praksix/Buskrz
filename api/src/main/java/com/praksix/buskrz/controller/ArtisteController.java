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

import com.praksix.buskrz.model.Artiste;
import com.praksix.buskrz.service.ArtisteService;



@RestController
@RequestMapping("/api/v1/artistes")
public class ArtisteController {
    
    @Autowired
    ArtisteService artisteService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<Artiste> getArtistes() {
        return artisteService.getArtistes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createArtiste(@RequestBody Artiste artiste) {
        artisteService.createArtiste(artiste);
    }

    @GetMapping("/{id}")
    public Optional<Artiste> getArtisteById(@PathVariable String id) {
        return artisteService.getArtisteById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateArtiste(@PathVariable String id, @RequestBody Artiste artiste) {
        artisteService.updateArtiste(artiste);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteArtiste(@PathVariable String id) {
        artisteService.deleteArtiste(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.OK)
    public void deleteAllArtiste() {
        artisteService.deleteAllArtistes();
    }
   
    
}
