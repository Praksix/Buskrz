import { test, expect } from '@playwright/test'

test('Flux complet : Localisation, Login Admin, Ajout, Validation et Vérification', async ({ page }) => {
  // 🛡️ Mock de la géolocalisation pour forcer Grenoble
  const mockLocation = {
    city: 'Grenoble',
    country_name: 'France',
    latitude: 45.1885,
    longitude: 5.7245
  };

  await page.route('https://ipapi.co/json/', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockLocation)
    });
  });

  await page.route('http://ip-api.com/json/', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockLocation,
        status: 'success',
        query: '8.8.8.8'
      })
    });
  });

  // 🎯 ÉTAPE 1 : Accueil et détection de ville
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Vous êtes à.*Grenoble/i })).toBeVisible({ timeout: 15000 });

  const cityButton = page.getByRole('button', { name: /Voir les concerts à.*Grenoble/i });
  await expect(cityButton).toBeVisible();

  // 🎯 ÉTAPE 2 : Connexion Admin
  await page.goto('/login');
  await page.fill('#email', 'toupoutou@toupoutou.com');
  await page.fill('#password', 'toupoutou');
  await page.click('button[type="submit"]');

  // Attendre d'être sur la page d'accueil avec le lien Dashboard visible (prouve le rôle ADMIN)
  await expect(page).toHaveURL('/', { timeout: 10000 });
  const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
  await expect(dashboardLink).toBeVisible({ timeout: 10000 });

  // 🎯 ÉTAPE 3 : Ajout d'un concert (PENDING)
  await page.getByRole('link', { name: 'Ajouter un concert' }).click();
  await expect(page.getByRole('heading', { name: 'Ajouter un concert' })).toBeVisible();

  const concertName = `Test Concert ${Date.now()}`;
  const artisteName = 'Artiste Playwright';

  await page.getByRole('textbox', { name: 'Nom du concert' }).fill(concertName);

  // 🆕 Nouveaux champs pour le système dynamique d'artistes
  await page.getByPlaceholder("Nom de l'artiste").first().fill(artisteName);
  await page.getByPlaceholder("Genre (ex: Rock, Punk, Pop...)").first().fill('Rock');

  // 🆕 Nouveau champ ville (input avec datalist = role combobox)
  await page.getByRole('combobox', { name: 'Ville *' }).fill('Grenoble');

  // Attendre un peu que la liste des lieux se filtre
  await page.waitForTimeout(500);

  // Le champ select = role combobox
  await page.getByRole('combobox', { name: 'Lieu du concert *' }).selectOption({ index: 1 });

  await page.getByRole('textbox', { name: 'Date *' }).fill('2026-05-01');
  await page.getByRole('textbox', { name: 'Heure' }).fill('21:00');
  await page.getByRole('textbox', { name: 'Prix' }).fill('15');

  await page.getByRole('button', { name: 'Ajouter le concert' }).click();
  await expect(page.getByText(/Concert proposé avec succès !/)).toBeVisible();

  // 🎯 ÉTAPE 4 : Dashboard Admin et Validation
  await dashboardLink.click(); // Utiliser le lien du header
  await expect(page.getByText('Tableau de Bord Administrateur')).toBeVisible();

  // Trouver le concert dans la liste des "en attente"
  const pendingConcertItem = page.locator('div').filter({ hasText: concertName }).last();
  await expect(pendingConcertItem).toBeVisible();
  await pendingConcertItem.click();

  // Sur la page de détails, cliquer sur Valider
  await expect(page.getByRole('heading', { name: concertName })).toBeVisible();
  await page.getByRole('button', { name: 'Valider' }).click();

  // Retour automatique vers le dashboard
  await expect(page).toHaveURL('/admin');

  // 🎯 ÉTAPE 5 : Vérification finale à Grenoble
  await page.goto('/concerts/Grenoble');

  // 1. Cibler le titre (heading) qui est unique grâce au timestamp
  const heading = page.getByRole('heading', { name: concertName });
  await expect(heading).toBeVisible();

  // 2. Cibler la carte spécifique en utilisant le titre comme "ancre" (has: heading)
  // On limite la recherche aux éléments ayant la classe 'rounded-xl' pour éviter de remonter jusqu'au root
  const concertCard = page.locator('.rounded-xl').filter({ has: heading });

  // 3. Vérifier l'artiste à l'intérieur de cette carte
  await expect(concertCard.getByText(artisteName)).toBeVisible();
});