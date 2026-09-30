import { expect, test } from '@playwright/test';
import { ask, lastReply, start, watchErrors } from './helpers';

test.describe('core loop — Ask → Explore → Cross-reference → Understand → Go deeper', () => {
  test('welcome offers both paths', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /What would you like to study today\?/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Romans 8' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Grace' }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('Romans 8: the conversation drives the dashboard', async ({ page }) => {
    const errors = watchErrors(page);
    await start(page, 'Romans 8');
    await expect(page.getByRole('heading', { level: 1, name: 'Romans 8' })).toBeVisible();
    await expect(page.locator('#section-scripture')).toContainText('no condemnation');

    await ask(page, 'What does condemnation mean?');
    expect(await lastReply(page)).toMatch(/κατάκριμα/);
    await expect(page.getByText(/Focused on .*κατάκριμα/)).toBeVisible();
    await expect(page.locator('#section-original-languages')).toContainText('κατάκριμα');

    await ask(page, 'Show me what Tim Keller says about this');
    await expect(page.locator('#section-commentary')).toContainText('Timothy Keller');
    expect(await lastReply(page)).not.toMatch(/“[^”]*”\s*—\s*Keller/); // never a fabricated Keller quotation

    await ask(page, 'Where else does Paul talk about this?');
    await expect(page.locator('#section-cross-references')).toContainText(/Paul/);

    await ask(page, 'Explain verse 28');
    expect(await lastReply(page)).toMatch(/28/);
    expect(errors).toEqual([]);
  });

  test('Psalm 23 declines honestly when no verified source exists', async ({ page }) => {
    await start(page, 'Psalm 23');
    await expect(page.getByRole('heading', { level: 1, name: 'Psalm 23' })).toBeVisible();
    await ask(page, 'What did Tim Keller say about this?');
    const reply = await lastReply(page);
    expect(reply).toMatch(/verified|won.t|invent/i);
    expect(reply).not.toMatch(/A Shepherd Looks at Psalm 23/); // W. Phillip Keller is a different author
  });

  test('John 1: Greek behind "Word" and the Genesis connection', async ({ page }) => {
    await start(page, 'John 1');
    await ask(page, "What is the Greek word behind 'Word'?");
    expect(await lastReply(page)).toMatch(/λόγος|logos/i);
    await ask(page, 'How does this connect with Genesis?');
    expect(await lastReply(page)).toMatch(/Gen/);
  });

  test('topic study: Grace', async ({ page }) => {
    await start(page, 'Grace');
    await expect(page.getByRole('heading', { level: 1, name: 'Grace' })).toBeVisible();
    await expect(page.locator('#section-key-passages')).toBeVisible();
    await ask(page, 'Are there different theological interpretations?');
    await expect(page.locator('#section-theology')).toContainText(/Reformed/);
  });

  test('library study for any passage (Genesis)', async ({ page }) => {
    await start(page, 'Genesis');
    await expect(page.getByRole('heading', { level: 1, name: 'Genesis' })).toBeVisible();
    await expect(page.locator('#section-scripture')).toContainText('In the beginning');
    await expect(page.locator('main#study').getByText('Library study', { exact: true }).first()).toBeVisible();
  });

  test('interlinear shows tagged Greek', async ({ page }) => {
    await start(page, 'John 1');
    await page.getByRole('radio', { name: 'Interlinear' }).or(page.getByRole('button', { name: 'Interlinear' })).first().click();
    await expect(page.locator('#section-scripture [lang="grc"]').first()).toBeVisible();
  });
});
