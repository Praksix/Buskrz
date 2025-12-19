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
    private String status;
    private String image;

    // Constructeur par défaut
    public Lieu() {
    }

    // Constructeur avec paramètres
    public Lieu(String id, String name, String city, String adresse, String website, String image) {
        this(id, name, city, adresse, website, "PENDING", image);
    }

    public Lieu(String id, String name, String city, String adresse, String website, String status, String image) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.adresse = adresse;
        this.website = website;
        this.status = status;
        this.image = image;
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

    public String getStatus() {
        return status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Lieu{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", adresse='" + adresse + '\'' +
                ", website='" + website + '\'' +
                ", status='" + status + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}
