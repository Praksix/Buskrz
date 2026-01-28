package com.praksix.buskrz.service;

import java.io.IOException;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.gridfs.model.GridFSFile;

/**
 * 🗄️ FileStorageService - Service de stockage de fichiers avec GridFS
 * 
 * Ce service gère le stockage et la récupération de fichiers (images) dans
 * MongoDB
 * en utilisant GridFS. GridFS est un système qui permet de stocker des fichiers
 * plus grands que la limite de 16Mo d'un document MongoDB.
 * 
 * Comment ça marche :
 * - GridFS découpe les fichiers en morceaux (chunks) de 255Ko
 * - Les morceaux sont stockés dans la collection "fs.chunks"
 * - Les métadonnées (nom, type, taille) sont dans "fs.files"
 * - Un ObjectId unique identifie chaque fichier
 */
@Service
public class FileStorageService {

    /**
     * GridFsTemplate - Outil pour STOCKER des fichiers dans MongoDB
     * Spring l'injecte automatiquement grâce à @Autowired
     */
    @Autowired
    private GridFsTemplate gridFsTemplate;

    /**
     * GridFsOperations - Outil pour RÉCUPÉRER des fichiers depuis MongoDB
     * Permet de reconstituer le fichier à partir des chunks
     */
    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * 📤 UPLOAD : Stocke un fichier dans MongoDB
     * 
     * @param file - Le fichier envoyé depuis le formulaire web (MultipartFile)
     * @return String - L'ID unique du fichier stocké (ex:
     *         "507f1f77bcf86cd799439011")
     * @throws IOException - Si erreur lors de la lecture du fichier
     * 
     *                     Exemple d'utilisation :
     *                     MultipartFile image = ... // Image du formulaire
     *                     String fileId = storeFile(image);
     *                     // fileId = "507f1f77bcf86cd799439011"
     *                     // Tu peux maintenant stocker cet ID dans ton Concert
     */
    public String storeFile(MultipartFile file) throws IOException {
        // gridFsTemplate.store() fait tout le travail :
        // 1. Lit le contenu du fichier (getInputStream)
        // 2. Le découpe en chunks de 255Ko
        // 3. Stocke chaque chunk dans fs.chunks
        // 4. Crée une entrée dans fs.files avec les métadonnées
        // 5. Retourne l'ObjectId unique du fichier
        ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(), // Le contenu du fichier (flux d'octets)
                file.getOriginalFilename(), // Le nom original (ex: "concert-rock.jpg")
                file.getContentType() // Le type MIME (ex: "image/jpeg")
        );

        // Convertit l'ObjectId en String pour faciliter le stockage
        return fileId.toString();
    }

    /**
     * 📥 DOWNLOAD : Récupère un fichier depuis MongoDB
     * 
     * @param fileId - L'ID du fichier à récupérer (String)
     * @return GridFsResource - Le fichier reconstitué (contenu + métadonnées)
     * 
     *         Exemple d'utilisation :
     *         GridFsResource resource = getFile("507f1f77bcf86cd799439011");
     *         InputStream content = resource.getInputStream(); // Le contenu
     *         String contentType = resource.getContentType(); // "image/jpeg"
     */
    public GridFsResource getFile(String fileId) {
        // Étape 1 : Chercher le fichier dans fs.files par son _id
        // Query.query() crée une requête MongoDB
        // Criteria.where("_id").is(...) = WHERE _id = fileId
        GridFSFile file = gridFsTemplate.findOne(
                Query.query(Criteria.where("_id").is(new ObjectId(fileId))));

        // Étape 2 : Si le fichier n'existe pas, retourner null
        if (file == null) {
            return null;
        }

        // Étape 3 : Reconstituer le fichier à partir des chunks
        // gridFsOperations.getResource() :
        // 1. Lit tous les chunks du fichier dans fs.chunks
        // 2. Les recolle dans le bon ordre
        // 3. Retourne un GridFsResource (comme un fichier normal)
        return gridFsOperations.getResource(file);
    }

    /**
     * 🗑️ DELETE : Supprime un fichier de MongoDB
     * 
     * @param fileId - L'ID du fichier à supprimer
     * 
     *               Note : Cette méthode supprime à la fois :
     *               - L'entrée dans fs.files (métadonnées)
     *               - Tous les chunks dans fs.chunks (contenu)
     */
    public void deleteFile(String fileId) {
        gridFsTemplate.delete(
                Query.query(Criteria.where("_id").is(new ObjectId(fileId))));
    }
}
