import { expect, test } from '@playwright/test'

test('starts a quick game and reaches the game screen', async ({ page }) => {
  await page.goto('/setup')

  await page.getByLabel('Number of players').fill('2')
  await page.getByLabel('Player 1 name').fill('Avery')
  await page.getByLabel('Player 2 name').fill('Jordan')
  await page.getByRole('button', { name: 'Quick Game' }).click()
  await page.getByRole('button', { name: 'Save setup and open game' }).click()

  await expect(page).toHaveURL(/\/game$/)
  await expect(
    page.getByRole('heading', { name: 'Deterministic turn flow is now active.' }),
  ).toBeVisible()
  await expect(page.getByText('Board size: 24 tiles. Current phase: await_roll.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Turn controls' })).toBeVisible()
})
