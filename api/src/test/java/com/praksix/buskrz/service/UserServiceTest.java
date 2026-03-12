package com.praksix.buskrz.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.praksix.buskrz.repository.UserRepository;
import static org.mockito.Mockito.*;

import com.praksix.buskrz.model.User;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private GridFsTemplate gridFsTemplate; // Requis car FileStorageService est chargé dans le contexte

    @MockBean
    private UserRepository userRepository;

    @Test
    @Disabled("MongoDB authentication required - to be fixed")
    void testCreatedAtAndUpdatedAtAreSetAutomatically() {
        // Créer un nouvel utilisateur sans définir createdAt et updatedAt
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setRole("USER");

        // Vérifier que les timestamps ne sont pas définis avant la sauvegarde
        assertNull(user.getCreatedAt());
        assertNull(user.getUpdatedAt());

        // Sauvegarder l'utilisateur
        userService.createUser(user);

        // Récupérer l'utilisateur sauvegardé
        Optional<User> savedUserOpt = userService.getUserById(user.getId());
        assertTrue(savedUserOpt.isPresent());

        User savedUser = savedUserOpt.get();

        // Vérifier que les timestamps ont été définis automatiquement
        assertNotNull(savedUser.getCreatedAt(), "createdAt devrait être défini automatiquement");
        assertNotNull(savedUser.getUpdatedAt(), "updatedAt devrait être défini automatiquement");

        // Vérifier que createdAt et updatedAt sont égaux lors de la création
        assertEquals(savedUser.getCreatedAt(), savedUser.getUpdatedAt(),
                "createdAt et updatedAt devraient être égaux lors de la création");

        // Attendre un peu pour s'assurer que les timestamps sont différents
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Modifier l'utilisateur
        savedUser.setName("Updated Test User");
        userService.updateUser(savedUser);

        // Récupérer l'utilisateur mis à jour
        Optional<User> updatedUserOpt = userService.getUserById(savedUser.getId());
        assertTrue(updatedUserOpt.isPresent());

        User updatedUser = updatedUserOpt.get();

        // Vérifier que createdAt n'a pas changé mais que updatedAt a été mis à jour
        assertEquals(savedUser.getCreatedAt(), updatedUser.getCreatedAt(),
                "createdAt ne devrait pas changer lors de la mise à jour");
        assertTrue(updatedUser.getUpdatedAt().isAfter(updatedUser.getCreatedAt()),
                "updatedAt devrait être postérieur à createdAt après la mise à jour");

        // Nettoyer
        userService.deleteUser(updatedUser.getId());
    }

    @Test
    void testAddConcertToLikesHandlesNullList() {
        // Simuler un utilisateur dont la liste de likes est nulle (cas des anciens
        // utilisateurs)
        String userId = "user123";
        String concertId = "concert456";

        User user = new User();
        user.setId(userId);
        user.setConcertsLikes(null); // On force à null pour simuler l'état en base

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Appeler la méthode à tester
        userService.addConcertToLikes(userId, concertId);

        // Vérifier que la liste a été initialisée et que le concert a été ajouté
        assertNotNull(user.getConcertsLikes());
        assertTrue(user.getConcertsLikes().contains(concertId));

        // Vérifier que repository.save a bien été appelé
        verify(userRepository, times(1)).save(user);
    }
}

//fin de test