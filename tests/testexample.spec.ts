import {test, expect} from "@playwright/test";

test('Order coffee - Espresso: Check that cart is empty', async ({page}) => {
    const snackbar = page.getByText('Thanks for your purchase. Please check your email for payment.');
    const checkout = page.locator('[data-test="checkout"]');
    
    await page.goto('https://coffee-cart.netlify.app/');
    await page.locator('[data-test="Espresso"]').click();
    await expect(checkout).toContainText('10.00');
    await checkout.click();
    await page.getByLabel('Name').fill('Test Client');
    await page.getByLabel('Email').fill('test@mail.com');
    await page.getByRole('button', { name: 'Submit'}).click();
    await expect(snackbar).toBeVisible();
    await expect(checkout).toHaveText('Total: $0.00');
});

// Menu tests

test('Add one coffee to cart: Check Total updated', async ({page}) => {});

test('Add two coffee to cart: Check Total updated', async ({page}) => {});

test('Add one coffee to cart, increase up to 3: Check Total updated for 3 items', async ({page}) => {});

test('Add three coffee to cart: Check Total updated for 3 items, Check discounted coffee proposed', async ({page}) => {});

test('Add one coffee to cart, increase up to 3, decrease by 1: Check Total updated for 2 items', async ({page}) => {});

test('Add three coffee to cart, accept discounted coffee: Check Total updated for 4 coffee', async ({page}) => {});

test('Add three coffee to cart, decline discounted coffee: Check Total updated for 3 coffee', async ({page}) => {});

test('Add one coffee to cart, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {});

test('Add three coffee to cart, accept discounted coffee, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {});

test('Add one coffee to cart, try to submit order (invalid email): Check Warning message, Check submit dialog not closed', async ({page}) => {});

test('Add no coffee via Right click: Check Total not updated', async ({page}) => {});

test('Add one coffee via Right click: Check Total updated', async ({page}) => {});

test('Add one coffee, open submit order, close submit order: Check Total not updated', async ({page}) => {});

test('Translation: Check coffee name translated via double click', async ({page}) => {});



// Cart tests

test('Add no coffee: Check cart is empty', async ({page}) => {});

test('Add one coffee, decrease quantity in the cart: Check cart is empty, Check Total is 0', async ({page}) => {});

test('Add two coffee, delete one added coffee in the cart: Check cart has one, Check Total is updated', async ({page}) => {});

test('Add one coffee, increase quantity in the cart: Check quantity is increased, Check Total is increased', async ({page}) => {});

test('Add one coffee, increase quantity in the cart, go back to menu: Check quantity is saved, Check Total is saved', async ({page}) => {});

test('Add two coffee, submit order (valid email) in the cart: Check Success message, Check Total is 0, Check page is Menu', async ({page}) => {});

test('Add one coffee, open submit order, close submit order: Check Total not updated, Check page is cart', async ({page}) => {});