package com.praksix.buskrz.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "concerts")
public class Concert {
    
    @Id
    private String id;
    private String name;
    private List<String> artisteIds = new ArrayList<>();
    private String lieuId;
    private LocalDate date;
    private LocalTime time;
    private String prix;
    private String description;
    private String image;
    private String lien;

    // Constructeur par défaut
    public Concert() {}
    public Concert(String id, String name, List<String> artisteIds, String lieuId, LocalDate date, LocalTime time, String prix, String description, String image, String lien) {
        this.id = id;
        this.name = name;
        this.artisteIds = artisteIds;
        this.lieuId = lieuId;
        this.date = date;
        this.time = time;
        this.prix = prix;
        this.description = description;
        this.image = image;
        this.lien = lien;
    }

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public List<String> getArtisteIds() {
        return artisteIds;
    }
    public String getLieuId() {
        return lieuId;
    }
    public LocalDate getDate() {
        return date;
    }
    
    public LocalTime getTime() {
        return time;
    }
    public String getPrix() {
        return prix;
    }
    public String getDescription() {
        return description;
    }
    public String getImage() {
        return image;
    }
    public String getLien() {
        return lien;
    }
    public void setId(String id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setArtisteIds(List<String> artisteIds) {
        this.artisteIds = artisteIds;
    }
    public void setLieuId(String lieuId) {
        this.lieuId = lieuId;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public void setTime(LocalTime time) {
        this.time = time;
    }
    public void setPrix(String prix) {
        this.prix = prix;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public void setLien(String lien) {
        this.lien = lien;
    }

    @Override
    public String toString() {
        return "Concert{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", artisteIds=" + artisteIds +
                ", lieuId='" + lieuId + '\'' +
                ", date='" + date + '\'' +
                ", time='" + time + '\'' +
                ", prix='" + prix + '\'' +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", lien='" + lien + '\'' +
                '}';
    }
}
