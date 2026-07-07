import { test, expect } from "@playwright/test";
import { MenuPage } from "../project/pages/MenuPage";

test('Add one coffee to cart: Check Total updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);

    await menuPage.assertTotal("Total: $12.00");
});

test('Add two coffee to cart: Check Total updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cappuccino", "Flat White"]);
    
    await menuPage.assertTotal("Total: $37.00");
});

test('Add one coffee to cart, increase up to 3: Check Total updated for 3 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Mocha", "Americano", "Espresso Con Panna"]);
    
    await menuPage.assertTotal("Total: $29.00");
});

test('Add three coffee to cart: Check Total updated for 3 items, Check discounted coffee proposed', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Mocha", "Americano", "Espresso Con Panna"]);
    
    await menuPage.assertPromoIsVisible(true);
});

test('Add one coffee to cart, increase up to 3, decrease by 1: Check Total updated for 2 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.hoverTotalBtn();
    await menuPage.removeFromCart("Cafe Breve");
    
    await menuPage.assertTotal("Total: $26.00");
});

test('Add three coffee to cart, accept discounted coffee: Check Total updated for 4 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.acceptPromo();
    
    await menuPage.assertTotal("Total: $45.00");
});

test('Add three coffee to cart, decline discounted coffee: Check Total updated for 3 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.declinePromo();
    
    await menuPage.assertTotal("Total: $41.00");
});

test('Add one coffee to cart, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "test@mail.com");
    
    await menuPage.assertHasSuccessMsg();
    await menuPage.assertTotal("Total: $0.00");
});

test('Add three coffee to cart, accept discounted coffee, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.acceptPromo();
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "test@mail.com");
    
    await menuPage.assertHasSuccessMsg();
    await menuPage.assertTotal("Total: $0.00");
});

test('Add one coffee to cart, try to submit order (invalid email): Check Warning message, Check submit dialog not closed', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "testmail.com");

    await paymentDetailsModal.assertDialogIsOpened(true);
    await menuPage.assertTotal("Total: $12.00");
});

test('Add no coffee via Right click: Check Total not updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    await menuPage.addToCartByRmb("Espresso Macchiato", false);

    await menuPage.assertTotal("Total: $12.00");
});

test('Add one coffee via Right click: Check Total updated', async ({page}) => {
    
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addToCartByRmb("Espresso Macchiato");

    await menuPage.assertTotal("Total: $12.00");
});

test('Add one coffee, open submit order, close submit order: Check Total not updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.closeSubmitDialog();

    await paymentDetailsModal.assertDialogIsOpened(false);
    await menuPage.assertTotal("Total: $12.00");
});

test('Translation: Check coffee name translated via double click', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.dblClickCoffeeTitle("Espresso");

    await menuPage.assertDrinkTitle("Espresso", "特浓咖啡 $10.00");
});