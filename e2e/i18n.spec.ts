import { expect, test, type Page } from '@playwright/test';
import { watchErrors } from './helpers';

/**
 * Interface & study language (docs/I18N.md): switching language changes the interface, the
 * Bible version list, references and the study itself; switching back restores English.
 */

interface Lang {
  id: 'pt' | 'es' | 'fr';
  endonym: string;
  bcp47: string;
  headline: string;
  form: string;
  composer: string;
  newStudy: string;
  conversation: string;
  languageButton: RegExp;
  versions: string[];
  romans8: string;
  /** Romans 8:1 in the language's default version (exact words) */
  romans8v1: string;
  grace: string;
  paletteQuery: string;
  paletteOpen: string;
}

const LANGS: Lang[] = [
  {
    id: 'pt',
    endonym: 'Português',
    bcp47: 'pt-BR',
    headline: 'O que vamos estudar hoje?',
    form: 'Iniciar um estudo',
    composer: 'Mensagem para o Emmaus',
    newStudy: 'Novo estudo',
    conversation: 'Conversa',
    languageButton: /^Idioma: Português$/,
    versions: ['BLIVRE', 'NBV', 'BPM'],
    romans8: 'Romanos 8',
    romans8v1: 'nenhuma condenação há',
    grace: 'Graça',
    paletteQuery: 'Romanos 8:28',
    paletteOpen: 'Abrir Romanos 8:28',
  },
  {
    id: 'es',
    endonym: 'Español',
    bcp47: 'es',
    headline: '¿Qué estudiamos hoy?',
    form: 'Empezar un estudio',
    composer: 'Mensaje para Emmaus',
    newStudy: 'Nuevo estudio',
    conversation: 'Conversación',
    languageButton: /^Idioma: Español$/,
    versions: ['RVR1909', 'BLM', 'VBL'],
    romans8: 'Romanos 8',
    romans8v1: 'ninguna condenación hay',
    grace: 'Gracia',
    paletteQuery: 'Romanos 8:28',
    paletteOpen: 'Abrir Romanos 8:28',
  },
  {
    id: 'fr',
    endonym: 'Français',
    bcp47: 'fr',
    headline: 'Que souhaitez-vous étudier aujourd’hui ?',
    form: 'Commencer une étude',
    composer: 'Message à Emmaus',
    newStudy: 'Nouvelle étude',
    conversation: 'Conversation',
    languageButton: /^Langue : Français$/,
    versions: ['LSG', 'DARBY', 'NCL', 'OST'],
    romans8: 'Romains 8',
    romans8v1: 'aucune condamnation',
    grace: 'Grâce',
    paletteQuery: 'Romains 8.28',
    paletteOpen: 'Ouvrir Romains 8.28',
  },
];

/** Pick a language from the top-bar menu (the button's name is "Language: English", "Idioma: Português", …). */
async function chooseLanguage(page: Page, endonym: string) {
  await page.locator('header button[aria-haspopup="menu"]').click();
  await page.getByRole('menuitemradio', { name: endonym }).click();
  await expect(page.getByRole('menuitemradio', { name: endonym })).toBeHidden();
}

/** Ids of the versions in the translation select's first group (the reader's language). */
async function ownVersions(page: Page): Promise<string[]> {
  return page.locator('header select optgroup').first().locator('option').evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value));
}

test.describe('languages', () => {
  for (const lang of LANGS) {
    test(`${lang.endonym}: interface, versions, welcome chips and study — then back to English`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto('/');
      await expect(page.getByRole('heading', { name: /What would you like to study today\?/ })).toBeVisible();

      await chooseLanguage(page, lang.endonym);

      // Interface
      await expect(page.locator('html')).toHaveAttribute('lang', lang.bcp47);
      await expect(page.getByRole('heading', { level: 1, name: lang.headline })).toBeVisible();
      await expect(page.getByRole('search', { name: lang.form })).toBeVisible();
      await expect(page.locator('header button[aria-haspopup="menu"]')).toHaveAttribute('aria-label', lang.languageButton);
      await expect(page.getByRole('button', { name: lang.grace, exact: true }).first()).toBeVisible();

      // Versions: the language's own first (its default selected), the others after
      await expect(page.locator('header select')).toHaveValue(lang.versions[0]);
      expect(await ownVersions(page)).toEqual(lang.versions);
      await expect(page.locator('header select option').first()).toHaveText(new RegExp(`^${lang.versions[0]} — `));
      await expect(page.locator('header select optgroup').nth(1).locator('option')).not.toHaveCount(0);

      // A welcome chip written in the language opens the study, with the default version's text
      await page.getByRole('button', { name: lang.romans8, exact: true }).first().click();
      await expect(page.getByRole('textbox', { name: lang.composer })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: lang.romans8 })).toBeVisible();
      await expect(page.locator('#section-scripture')).toContainText(lang.romans8v1, { timeout: 15_000 });
      await expect(page.getByRole('button', { name: lang.newStudy })).toBeVisible();
      await expect(page.locator('#conversation').getByRole('heading', { name: lang.conversation })).toBeVisible();

      // Back to English: the interface, the version and the open study all follow
      const replies = await page.locator('article[aria-label="Emmaus"]').count();
      await chooseLanguage(page, 'English');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('textbox', { name: 'Message Emmaus' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'New study' })).toBeVisible();
      await expect(page.locator('header select')).toHaveValue('BSB');
      expect(await ownVersions(page)).toEqual(['BSB', 'KJV', 'WEB']);
      await expect(page.getByRole('heading', { level: 1, name: 'Romans 8' })).toBeVisible();
      await expect(page.locator('#section-scripture')).toContainText('no condemnation', { timeout: 15_000 });
      // The study was re-opened in English without a new reply — just one short notice.
      await expect(page.locator('#conversation [role="note"]').last()).toHaveText('The study is now shown in English.');
      expect(await page.locator('article[aria-label="Emmaus"]').count()).toBe(replies);
      expect(errors).toEqual([]);
    });
  }

  test('the search palette understands references and labels in the reader’s language', async ({ page }) => {
    await page.goto('/');
    for (const lang of LANGS) {
      await chooseLanguage(page, lang.endonym);
      await page.locator('header button[aria-keyshortcuts]').click(); // the top-bar search (its name is localized)
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('combobox').fill(lang.paletteQuery);
      await expect(dialog.getByRole('option').first()).toContainText(lang.paletteOpen);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });

  test('the language menu works from the keyboard', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('header button[aria-haspopup="menu"]');
    await button.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitemradio', { name: 'English' })).toBeFocused();
    await expect(page.getByRole('menuitemradio', { name: 'English' })).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitemradio', { name: 'Português' })).toBeFocused();
    await page.keyboard.press('f'); // type-ahead
    await expect(page.getByRole('menuitemradio', { name: 'Français' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
    await expect(page.getByRole('menuitemradio', { name: 'Français' })).toBeHidden();
    await page.keyboard.press('Enter');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(button).toBeFocused();
  });

  test('phone layout: the language menu is in the top bar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await chooseLanguage(page, 'Español');
    await expect(page.getByRole('heading', { level: 1, name: '¿Qué estudiamos hoy?' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

test.describe('first visit in Portuguese', () => {
  test.use({ locale: 'pt-BR' });

  test('the browser language picks the interface and the Bible version', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1, name: 'O que vamos estudar hoje?' })).toBeVisible();
    await expect(page.locator('header select')).toHaveValue('BLIVRE');
    // welcome chips come first; featured study cards may carry the same (localized) titles
    await expect(page.getByRole('button', { name: 'Gênesis', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Salmo 23', exact: true }).first()).toBeVisible();
  });
});
