#!/bin/bash

# Script d'analyse de code avec SonarLint
echo "🔍 Analyse de code avec SonarLint..."

# Vérifier que Maven est installé
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Nettoyer et compiler
echo "🧹 Nettoyage du projet..."
mvn clean compile

# Lancer les tests
echo "🧪 Exécution des tests..."
mvn test

# Générer le rapport de couverture
echo "📊 Génération du rapport de couverture..."
mvn jacoco:report

# Analyse SonarLint (sans serveur SonarQube)
echo "🔍 Analyse SonarLint locale..."
if [ -n "$SONAR_TOKEN" ] && [ -n "$SONAR_ORGANIZATION" ]; then
  mvn sonar:sonar \
    -Dsonar.organization=$SONAR_ORGANIZATION \
    -Dsonar.projectKey=buskrz-api \
    -Dsonar.projectName="Buskrz API" \
    -Dsonar.sources=src/main/java \
    -Dsonar.tests=src/test/java \
    -Dsonar.java.source=21 \
    -Dsonar.java.target=21 \
    -Dsonar.sourceEncoding=UTF-8
else
  echo "⚠️ SonarLint analysis skipped - missing SONAR_TOKEN or SONAR_ORGANIZATION environment variables"
  echo "To enable SonarLint analysis, set these environment variables:"
  echo "export SONAR_TOKEN=your_sonarcloud_token"
  echo "export SONAR_ORGANIZATION=your_sonarcloud_organization"
fi

echo "✅ Analyse terminée !"
echo "📋 Consultez le rapport dans target/sonar/ pour plus de détails."
