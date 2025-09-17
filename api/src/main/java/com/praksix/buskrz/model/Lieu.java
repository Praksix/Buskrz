package com.praksix.buskrz.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lieux")
public class Lieu {
    
    @Id
    private String id;
    private String name;
    private String city;
    private String adresse;

    // Constructeur par défaut
    public Lieu() {}

    // Constructeur avec paramètres
    public Lieu(String id, String name, String city, String adresse) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.adresse = adresse;
    }

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getCity() {
        return city;
    }
    public String getAdresse() {
        return adresse;
    }

    public void setId(String id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    @Override
    public String toString() {
        return "Lieu{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", adresse='" + adresse + '\'' +
                '}';
    }
}
