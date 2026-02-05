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

import com.praksix.buskrz.model.Lieu;
import com.praksix.buskrz.service.LieuService;

@RestController
@RequestMapping("/api/v1/lieux")
public class LieuController {

    @Autowired
    LieuService lieuService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<Lieu> getLieux() {
        return lieuService.getLieux();
    }

    @GetMapping("/city/{city}")
    public Optional<Lieu> getLieuByCity(@PathVariable String city) {
        return lieuService.getLieuByCity(city);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createLieu(@RequestBody Lieu lieu) {
        lieuService.createLieu(lieu);
    }

    @GetMapping("/{id}")
    public Optional<Lieu> getLieuById(@PathVariable String id) {
        return lieuService.getLieuById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateLieu(@PathVariable String id, @RequestBody Lieu lieu) {
        lieuService.updateLieu(lieu);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteLieu(@PathVariable String id) {
        lieuService.deleteLieu(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.OK)
    public void deleteAllLieux() {
        lieuService.deleteAllLieux();
    }

    @GetMapping("/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    public Collection<Lieu> getLieuxByStatus(@PathVariable String status) {
        return lieuService.getLieuxByStatus(status);
    }

    @PutMapping("/validate/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void validateLieu(@PathVariable String id) {
        lieuService.validateLieu(id);
    }

}
