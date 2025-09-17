package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.Artiste;

@Service
public interface ArtisteService {
    

    public void createArtiste(Artiste artiste);
    public void updateArtiste(Artiste artiste);
    public Collection<Artiste> getArtistes();
    public void deleteArtiste(String id);
    public void deleteAllArtistes();
    public Optional<Artiste> getArtisteById(String id);
    



}
