package com.praksix.buskrz.controller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.praksix.buskrz.model.Concert;
import com.praksix.buskrz.model.User;
import com.praksix.buskrz.repository.UserRepository;
import com.praksix.buskrz.service.ConcertService;
import com.praksix.buskrz.service.JwtService;
import com.praksix.buskrz.service.UserService;



@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @Autowired
    UserService userService;
    
    @Autowired
    ConcertService concertService;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    JwtService jwtService;

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public User getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide");
        }
        
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Collection<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestBody User user) {
        userService.createUser(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateUser(@PathVariable String id, @RequestBody User user) {
        userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.OK)
    public void deleteAllUsers() {
        userService.deleteAllUsers();
    }

    // Endpoints pour gérer les concertsLikes
    @PostMapping("/{userId}/concerts/{concertId}/like")
    @ResponseStatus(HttpStatus.OK)
    public void addConcertToLikes(@PathVariable String userId, @PathVariable String concertId) {
        userService.addConcertToLikes(userId, concertId);
    }

    @DeleteMapping("/{userId}/concerts/{concertId}/like")
    @ResponseStatus(HttpStatus.OK)
    public void removeConcertFromLikes(@PathVariable String userId, @PathVariable String concertId) {
        userService.removeConcertFromLikes(userId, concertId);
    }

    @GetMapping("/{userId}/concerts/liked")
    @ResponseStatus(HttpStatus.OK)
    public List<Concert> getUserLikedConcerts(@PathVariable String userId) {
        List<String> concertIds = userService.getUserLikedConcerts(userId);
        return concertIds.stream()
                .map(concertId -> concertService.getConcertById(concertId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }
   
    
}
