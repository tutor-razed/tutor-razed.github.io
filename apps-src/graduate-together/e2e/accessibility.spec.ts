import { expect, test } from '@playwright/test'

test('applies and persists accessibility preferences', async ({ page }) => {
  await page.goto('/accessibility')

  await expect(page.locator('#main-content')).toBeFocused()
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
    'href',
    '#main-content',
  )

  await page.getByLabel('Reduced motion').check()
  await page.getByLabel('High contrast').check()
  await page.getByLabel('Text size').selectOption('x-large')

  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'x-large')

  await page.reload()

  await expect(page.getByLabel('Reduced motion')).toBeChecked()
  await expect(page.getByLabel('High contrast')).toBeChecked()
  await expect(page.getByLabel('Text size')).toHaveValue('x-large')
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'x-large')
})
