package com.praksix.buskrz.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.User;
import com.praksix.buskrz.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository repository;

    @Override
    public void createUser(User user) {
        repository.save(user);
    }

    @Override
    public void updateUser(User user) {
        repository.save(user);
    }

    @Override
    public Collection<User> getUsers() {
        return repository.findAll();
    }

    @Override
    public void deleteUser(String id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAllUsers() {
        repository.deleteAll();
    }

    @Override
    public Optional<User> getUserById(String id) {
        return repository.findById(id);
    }

    @Override
    public void addConcertToLikes(String userId, String concertId) {
        Optional<User> userOpt = repository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> likes = user.getConcertsLikes();
            if (likes == null) {
                likes = new ArrayList<>();
                user.setConcertsLikes(likes);
            }
            if (!likes.contains(concertId)) {
                likes.add(concertId);
                repository.save(user);
            }
        }
    }

    @Override
    public void removeConcertFromLikes(String userId, String concertId) {
        Optional<User> userOpt = repository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.getConcertsLikes().remove(concertId);
            repository.save(user);
        }
    }

    @Override
    public List<String> getUserLikedConcerts(String userId) {
        Optional<User> userOpt = repository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getConcertsLikes();
        }
        return List.of(); // Retourne une liste vide si l'utilisateur n'existe pas
    }
}
