import { expect, type Page } from '@playwright/test';

/** Collect console errors and uncaught exceptions for the whole test. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

/** Start a study from the welcome screen. */
export async function start(page: Page, query: string) {
  await page.goto('/');
  const form = page.getByRole('search', { name: 'Start a study' });
  await form.getByRole('textbox').fill(query);
  await form.getByRole('textbox').press('Enter');
  await expect(page.getByRole('textbox', { name: 'Message Emmaus' })).toBeVisible();
}

/** Ask a follow-up and wait for the assistant's reply to land. */
export async function ask(page: Page, text: string) {
  const composer = page.getByRole('textbox', { name: 'Message Emmaus' });
  const before = await page.locator('article[aria-label="Emmaus"]').count();
  await composer.fill(text);
  await composer.press('Enter');
  await expect
    .poll(async () => page.locator('article[aria-label="Emmaus"]').count(), { timeout: 15_000 })
    .toBeGreaterThan(before);
}

/** Text of the most recent assistant reply. */
export async function lastReply(page: Page): Promise<string> {
  return page.locator('article[aria-label="Emmaus"]').last().innerText();
}
