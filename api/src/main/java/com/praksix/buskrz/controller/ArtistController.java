package com.praksix.buskrz.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.praksix.buskrz.model.Artiste;
import com.praksix.buskrz.service.ArtisteService;

@RestController
@RequestMapping("/api/v1")
public class ArtistController {
    
    @Autowired
    ArtisteService artisteService;

    @GetMapping("/test")
    @ResponseStatus(HttpStatus.OK)
    public String test() {
        return "Test endpoint works!";
    }

    //TODO: Que faire de ce fichier? peut être déplacé dans un ArtisteController ou à renommer

    /**
     * Trouve un artiste par nom ou le crée s'il n'existe pas
     * Body : { "name": "NomArtiste", "genre": "Rock" }
     * @return L'artiste trouvé ou créé
     */
    @PostMapping("/artist-find-or-create")
    @ResponseStatus(HttpStatus.OK)
    public Artiste findOrCreateArtiste(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String genre = request.get("genre");
        return artisteService.findOrCreateArtiste(name, genre);
    }
}
