package com.praksix.buskrz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permettre toutes les origines (plus flexible)
        config.addAllowedOriginPattern("*");
        
        // Permettre tous les headers
        config.addAllowedHeader("*");
        
        // Permettre toutes les méthodes HTTP
        config.addAllowedMethod("*");
        
        // Permettre les credentials (cookies, etc.)
        config.setAllowCredentials(true);
        
        // Exposer tous les headers dans la réponse
        config.addExposedHeader("*");
        
        // Durée de cache pour les requêtes preflight
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
