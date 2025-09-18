package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.User;

@Service
public interface UserService {
    

    public void createUser(User user);
    public void updateUser(User user);

    public Collection<User> getUsers();

    public void deleteUser(String id);

    public void deleteAllUsers();

    public Optional<User> getUserById(String id);

    // Méthodes pour gérer les concertsLikes
    public void addConcertToLikes(String userId, String concertId);
    public void removeConcertFromLikes(String userId, String concertId);
    public List<String> getUserLikedConcerts(String userId);

}
