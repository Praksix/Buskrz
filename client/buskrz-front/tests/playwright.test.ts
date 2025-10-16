import { test, expect } from '@playwright/test'

test('Ajout de concert et vérification sur la page des concerts par ville', async ({ page }) => {
  // 🎯 ÉTAPE 1 : Aller sur la page d'accueil
  await page.goto('http://localhost:5173')
  await expect(page.getByText('Voir les concerts')).toBeVisible()
  
  // 🎯 ÉTAPE 2 : Aller à la page d'ajout de concert
  await page.getByRole('button', { name: 'Voir les concerts à Grenoble →' }).click();
  await page.getByRole('link', { name: 'Ajouter un concert' }).click();
  
  // 🎯 ÉTAPE 3 : Remplir le formulaire avec des données de test
  const concertData = {
    name: 'Soirée Jazz Test',
    artiste: 'ColtraneTest',
    genre: 'Jazz',
    date: '2025-10-23',
    time: '20:00',
    prix: '5'
  };
  
  await page.getByRole('textbox', { name: 'Nom du concert *' }).fill(concertData.name);
  await page.getByRole('textbox', { name: 'Noms des artistes (séparés' }).fill(concertData.artiste);
  await page.getByLabel('Genre musical 🎸').selectOption(concertData.genre);
  await page.getByLabel('Lieu du concert *').selectOption('68cab7855474f8a2dd3a4b1b');
  await page.getByRole('textbox', { name: 'Date *' }).fill(concertData.date);
  await page.getByRole('textbox', { name: 'Heure' }).fill(concertData.time);
  await page.getByRole('textbox', { name: 'Prix' }).fill(concertData.prix);
  
  // 🎯 ÉTAPE 4 : Soumettre le formulaire
  await page.getByRole('button', { name: 'Ajouter le concert' }).click();
  
  // 🎯 ÉTAPE 5 : Attendre le message de succès
  await expect(page.getByText('Concert ajouté avec succès !')).toBeVisible();
  
  // 🎯 ÉTAPE 6 : Aller sur la page des concerts par ville (Grenoble)
  await page.goto('http://localhost:5173/concerts/Grenoble');
  
  // 🎯 ÉTAPE 7 : Vérifier que le titre de la page contient "Grenoble"
  await expect(page.getByText('Concerts à Grenoble')).toBeVisible();
  
  // 🎯 ÉTAPE 8 : Vérifier que les informations du concert ajouté sont présentes
  // Vérifier le nom du concert (premier heading trouvé)
  await expect(page.getByRole('heading', { name: concertData.name }).first()).toBeVisible();
  
  // Vérifier que l'artiste est présent quelque part sur la page
  await expect(page.getByText(concertData.artiste)).toBeVisible();
  
  // Vérifier que le genre est présent dans la section des genres (pas dans le titre)
  await expect(page.locator('span.text-white.italic.text-2xl.font-thin').filter({ hasText: concertData.genre }).first()).toBeVisible();
  
  // Vérifier que notre concert spécifique est présent (nom + artiste)
  await expect(page.getByText(concertData.name)).toBeVisible();
  await expect(page.getByText(concertData.artiste)).toBeVisible();
})