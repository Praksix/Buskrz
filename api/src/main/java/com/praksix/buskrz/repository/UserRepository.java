package com.praksix.buskrz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.praksix.buskrz.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Méthodes personnalisées basées sur les propriétés du modèle User
    public Optional<User> findByEmail(String email);
    public List<User> findByRole(String role);
    public List<User> findByName(String name);
}
