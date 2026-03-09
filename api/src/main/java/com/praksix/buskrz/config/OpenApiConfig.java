package com.praksix.buskrz.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI buskrzOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Buskrz API")
                        .description("Documentation de l'API backend pour Buskrz - Projet scolaire")
                        .version("v0.0.1")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
