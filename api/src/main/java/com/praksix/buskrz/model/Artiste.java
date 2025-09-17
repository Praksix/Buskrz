package com.praksix.buskrz.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "artistes")
public class Artiste {
    
    @Id
    private String id;
    private String name;
    private List<String> genres;

    // Constructeur par défaut
    public Artiste() {}

    // Constructeur avec paramètres
    public Artiste(String id, String name, List<String> genres) {
        this.id = id;
        this.name = name;
        this.genres = genres != null ? genres : new ArrayList<>();
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<String> getGenres() {
        return genres;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres != null ? genres : new ArrayList<>();
    }

    // Méthodes utilitaires pour les genres
    public void addGenre(String genre) {
        if (this.genres == null) {
            this.genres = new ArrayList<>();
        }
        if (genre != null && !this.genres.contains(genre)) {
            this.genres.add(genre);
        }
    }

    public void removeGenre(String genre) {
        if (this.genres != null) {
            this.genres.remove(genre);
        }
    }

    @Override
    public String toString() {
        return "Artiste{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", genres=" + genres +
                '}';
    }
}
