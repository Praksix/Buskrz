package com.praksix.buskrz.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.praksix.buskrz.service.FileStorageService;

/**
 * 🎮 FileController - Contrôleur REST pour la gestion des fichiers
 * 
 * Ce contrôleur expose les endpoints HTTP pour :
 * - Uploader des fichiers (images de concerts)
 * - Télécharger/afficher des fichiers
 * - Supprimer des fichiers
 * 
 * Base URL : /api/v1/files
 * 
 * Endpoints disponibles :
 * POST /api/v1/files/upload → Uploader un fichier
 * GET /api/v1/files/{id} → Récupérer un fichier
 * DELETE /api/v1/files/{id} → Supprimer un fichier
 */
@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    /**
     * Injection du service de stockage de fichiers
     * Spring crée automatiquement une instance de FileStorageService
     */
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * 📤 UPLOAD - Endpoint pour uploader un fichier
     * 
     * URL : POST /api/v1/files/upload
     * 
     * @param file - Le fichier envoyé dans la requête (form-data, clé "file")
     * @return ResponseEntity avec le fileId en JSON
     * 
     *         Exemple de requête (depuis le frontend) :
     *         const formData = new FormData();
     *         formData.append('file', imageFile);
     *         fetch('/api/v1/files/upload', { method: 'POST', body: formData });
     * 
     *         Exemple de réponse :
     *         { "fileId": "507f1f77bcf86cd799439011" }
     * 
     *         Le frontend stocke ensuite ce fileId dans le champ "image" du Concert
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file // "file" = nom du champ dans FormData
    ) {
        try {
            // Vérification : le fichier n'est pas vide
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le fichier est vide"));
            }

            // Vérification : c'est bien une image
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le fichier doit être une image"));
            }

            // Stocker le fichier et récupérer son ID
            String fileId = fileStorageService.storeFile(file);

            // Retourner l'ID en JSON
            // Le frontend utilisera cet ID pour construire l'URL de l'image
            return ResponseEntity.ok(Map.of(
                    "fileId", fileId,
                    "message", "Fichier uploadé avec succès"));

        } catch (IOException e) {
            // En cas d'erreur de lecture du fichier
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'upload : " + e.getMessage()));
        }
    }

    /**
     * 📥 GET FILE - Endpoint pour récupérer/afficher un fichier
     * 
     * URL : GET /api/v1/files/{id}
     * 
     * @param id - L'ID du fichier (ObjectId converti en String)
     * @return Le contenu du fichier avec le bon Content-Type
     * 
     *         Comment l'utiliser dans le frontend :
     *         <img src=
     *         "http://localhost:8080/api/v1/files/507f1f77bcf86cd799439011" />
     * 
     *         Le navigateur fait une requête GET et affiche directement l'image
     */
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        try {
            // Récupérer le fichier depuis GridFS
            GridFsResource resource = fileStorageService.getFile(id);

            // Si le fichier n'existe pas, retourner 404
            if (resource == null) {
                return ResponseEntity.notFound().build();
            }

            // Lire le contenu du fichier en bytes
            byte[] content = resource.getInputStream().readAllBytes();

            // Retourner le fichier avec :
            // - Le bon Content-Type (image/jpeg, image/png, etc.)
            // - Le contenu en bytes
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .body(content);

        } catch (IllegalArgumentException e) {
            // ID invalide (pas un ObjectId valide)
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            // Erreur de lecture du fichier
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 🗑️ DELETE - Endpoint pour supprimer un fichier
     * 
     * URL : DELETE /api/v1/files/{id}
     * 
     * @param id - L'ID du fichier à supprimer
     * @return 200 OK si supprimé, 404 si non trouvé
     * 
     *         Note : À utiliser quand on supprime un concert,
     *         pour ne pas laisser des images orphelines dans MongoDB
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String id) {
        try {
            fileStorageService.deleteFile(id);
            return ResponseEntity.ok(Map.of("message", "Fichier supprimé avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "ID de fichier invalide"));
        }
    }
}
