# Utilise une image avec Maven et JDK 21 pour correspondre au pom.xml
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copie le pom.xml et télécharge les dépendances (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie le code source et compile l'application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Image finale légère avec JRE 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Crée un utilisateur non-root pour la sécurité
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copie le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Expose le port configuré dans application.properties
EXPOSE 8080

# Configuration JVM optimisée pour les conteneurs
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"

# Point d'entrée avec variables d'environnement
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]