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
    private String website;

    // Constructeur par défaut
    public Lieu() {}

    // Constructeur avec paramètres
    public Lieu(String id, String name, String city, String adresse) {
        this(id, name, city, adresse, null);
    }

    public Lieu(String id, String name, String city, String adresse, String website) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.adresse = adresse;
        this.website = website;
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
    public String getWebsite() {
        return website;
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
    public void setWebsite(String website) {
        this.website = website;
    }

    @Override
    public String toString() {
        return "Lieu{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", adresse='" + adresse + '\'' +
                ", website='" + website + '\'' +
                '}';
    }
}
