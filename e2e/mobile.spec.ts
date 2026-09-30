import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('phone: Chat | Study | Sources panes', async ({ page }) => {
  await start(page, 'Romans 8');
  const tabs = page.getByRole('navigation', { name: 'Panes' });
  await expect(tabs).toBeVisible();
  await tabs.getByRole('button', { name: /Study/ }).or(tabs.getByRole('tab', { name: /Study/ })).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Romans 8' })).toBeVisible();
  await tabs.getByRole('button', { name: /Sources/ }).or(tabs.getByRole('tab', { name: /Sources/ })).first().click();
  await expect(page.locator('#sources').getByText(/Berean Standard Bible/).first()).toBeVisible();
});
