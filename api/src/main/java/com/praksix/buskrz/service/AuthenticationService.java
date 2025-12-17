package com.praksix.buskrz.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.praksix.buskrz.dto.AuthenticationRequest;
import com.praksix.buskrz.dto.AuthenticationResponse;
import com.praksix.buskrz.dto.RegisterRequest;
import com.praksix.buskrz.exception.UserAlreadyExistsException;
import com.praksix.buskrz.model.Role;
import com.praksix.buskrz.model.User;
import com.praksix.buskrz.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Un compte avec cet email existe déjà");
        }
        
        var user = User.builder()
                .name(request.getNom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER.name())
                .build();
                
        var savedUser = userRepository.save(user);
        
        // Générer le token JWT
        var jwtToken = jwtService.generateToken(savedUser);
        
        // Vérifier que le token a bien été généré
        if (jwtToken == null || jwtToken.isEmpty()) {
            throw new RuntimeException("Erreur lors de la génération du token JWT");
        }
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Récupérer l'utilisateur
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
        
        // Générer le token JWT
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}