const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Ilari Ranin',
        username: 'ippe',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    await page.getByRole('button', { name: 'login'}).click()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()


    })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login'}).click()
    })

    test('succeeds with correct credentials', async ({ page }) => {
    await page.getByPlaceholder('username').fill('ippe')
    await page.getByPlaceholder('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('ippe logged in')).toBeVisible()
    })

    test('fails with Wrong username or password', async ({ page }) => {
    await page.getByPlaceholder('username').fill('joku')
    await page.getByPlaceholder('password').fill('väärä')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Wrong username or password')).toBeVisible()
    await expect(page.getByText('ippe logged in')).not.toBeVisible()

      })
    })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login'}).click()
      await page.getByPlaceholder('username').fill('ippe')
      await page.getByPlaceholder('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

    })
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title here...').fill('playwright title')
      await page.getByPlaceholder('author here...').fill('playwright author')
      await page.getByPlaceholder('url here...').fill('playwright url')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('playwright title').nth(1)).toBeVisible()


    })
  })
  describe('When logged in and blogs created', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login'}).click()
      await page.getByPlaceholder('username').fill('ippe')
      await page.getByPlaceholder('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title here...').fill('playwright title')
      await page.getByPlaceholder('author here...').fill('playwright author')
      await page.getByPlaceholder('url here...').fill('playwright url')
      await page.getByRole('button', { name: 'create' }).click()
    })
    test('liking succeeds', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(3000)
      await expect(page.locator('text=Likes: 1')).toBeVisible()
    })
    test('deleting blog succeeds', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Delete blog?')
        await dialog.accept();
      });
      await page.getByRole('button', { name: 'remove' }).click()
      
      await page.waitForTimeout(3000)
      await expect(page.getByText('playwright title')).not.toBeVisible()
    })
  })
  describe('Challenging tests', () => {
    test('only the user who created the blog sees the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Matti Meikäläinen',
          username: 'matti',
          password: 'salasana'
        }
      })

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('ippe')
      await page.getByPlaceholder('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title here...').fill('blog by ippe')
      await page.getByPlaceholder('author here...').fill('Ilari')
      await page.getByPlaceholder('url here...').fill('joku.com')
      await page.getByRole('button', { name: /create/i }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('matti')
      await page.getByPlaceholder('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })
    test('blogs are ordered by likes in descending order', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('ippe')
      await page.getByPlaceholder('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      const blogs = [
        { title: 'first blog', likes: 1 },
        { title: 'second blog', likes: 3 },
        { title: 'third blog', likes: 2 }
      ]

      for (const blog of blogs) {
        await page.waitForTimeout(1000)
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title here...').fill(blog.title)
        await page.getByPlaceholder('author here...').fill('tester')
        await page.getByPlaceholder('url here...').fill('some.url')
        await page.getByRole('button', { name: /create/i }).click()
      }

      for (const blog of blogs) {
        await page.getByText(blog.title).locator('..').getByRole('button', { name: 'view' }).click()
      }

      const likeBlog = async (title, count) => {
        const blog = page.locator('text=' + title).locator('..')
        for (let i = 0; i < count; i++) {
          await page.waitForTimeout(1000)
          await blog.getByRole('button', { name: 'like' }).click()
        }
      }

      await likeBlog('first blog', 1)
      await likeBlog('second blog', 3)
      await likeBlog('third blog', 2)

      const blogTitles = await page.locator('.blogStyle').evaluateAll(nodes => nodes.map(n => n.textContent))

      expect(blogTitles[0]).toContain('second blog')
      expect(blogTitles[1]).toContain('third blog')
      expect(blogTitles[2]).toContain('first blog')
    })

  })
})