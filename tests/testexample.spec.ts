import {test, expect} from "@playwright/test";
import { MenuPage } from "../project/pages/MenuPage";
import { CartPage } from "../project/pages/CartPage";
import { HeaderView } from "../project/pages/HeaderView";

// Menu tests

test('Add one coffee to cart: Check Total updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    
    expect(await menuPage.getTotal()).toBe("Total: $12.00");
});

test('Add two coffee to cart: Check Total updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cappuccino", "Flat White"]);
    
    expect(await menuPage.getTotal()).toBe("Total: $37.00");
});

test('Add one coffee to cart, increase up to 3: Check Total updated for 3 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Mocha", "Americano", "Espresso Con Panna"]);
    
    expect(await menuPage.getTotal()).toBe("Total: $29.00");
});

test('Add three coffee to cart: Check Total updated for 3 items, Check discounted coffee proposed', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Mocha", "Americano", "Espresso Con Panna"]);
    
    expect(await menuPage.isPromoVisible()).toBe(true);
});

test('Add one coffee to cart, increase up to 3, decrease by 1: Check Total updated for 2 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.hoverTotalBtn();
    await menuPage.removeFromCart("Cafe Breve");
    
    expect(await menuPage.getTotal()).toBe("Total: $26.00");
});

test('Add three coffee to cart, accept discounted coffee: Check Total updated for 4 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.acceptPromo();
    
    expect(await menuPage.getTotal()).toBe("Total: $45.00");
});

test('Add three coffee to cart, decline discounted coffee: Check Total updated for 3 coffee', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.declinePromo();
    
    expect(await menuPage.getTotal()).toBe("Total: $41.00");
});

test('Add one coffee to cart, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "test@mail.com");
    
    expect(await menuPage.getSuccessMsg()).toBe("Thanks for your purchase. Please check your email for payment.");
    expect(await menuPage.getTotal()).toBe("Total: $0.00");
});

test('Add three coffee to cart, accept discounted coffee, submit order (valid email): Check Success message, Check Total is 0', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Cafe Latte", "Cafe Breve", "Espresso"]);
    await menuPage.acceptPromo();
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "test@mail.com");
    
    expect(await menuPage.getSuccessMsg()).toBe("Thanks for your purchase. Please check your email for payment.");
    expect(await menuPage.getTotal()).toBe("Total: $0.00");
});

test('Add one coffee to cart, try to submit order (invalid email): Check Warning message, Check submit dialog not closed', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "testmail.com");

    expect(await paymentDetailsModal.isDialogOpened()).toBe(true);
    expect(await menuPage.getTotal()).toBe("Total: $12.00");
});

test('Add no coffee via Right click: Check Total not updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    await menuPage.addToCartByRmb("Espresso Macchiato", false);

    expect(await menuPage.getTotal()).toBe("Total: $12.00");
});

test('Add one coffee via Right click: Check Total updated', async ({page}) => {
    
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addToCartByRmb("Espresso Macchiato");

    expect(await menuPage.getTotal()).toBe("Total: $12.00");
});

test('Add one coffee, open submit order, close submit order: Check Total not updated', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso Macchiato"]);
    const paymentDetailsModal = await menuPage.clickTotalBtn();
    await paymentDetailsModal.closeSubmitDialog();

    expect(await paymentDetailsModal.isDialogOpened()).toBe(false);
    expect(await menuPage.getTotal()).toBe("Total: $12.00");
});

test('Translation: Check coffee name translated via double click', async ({page}) => {
    const menuPage = new MenuPage(page);

    await menuPage.navigateTo();
    await menuPage.dblClickCoffeeTitle("Espresso");

    expect(await menuPage.getCoffeeTitleValue("Espresso")).toBe("特浓咖啡 $10.00");
});



// Cart tests

test('Add no coffee: Check cart is empty', async ({page}) => {
    const cartPage = new CartPage(page);

    await cartPage.navigateTo();
    
    await cartPage.assertHaveNoCoffeeMessage();
});

test('Add one coffee, decrease quantity in the cart: Check cart is empty, Check Total is 0', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso"]);
    await headerView.navigateToTab("Cart page");
    await cartPage.changeCoffeeNumber("Espresso", false, 1);

    await cartPage.assertHaveNoCoffeeMessage();
});

test('Add two coffee, delete one added coffee in the cart: Check cart has one, Check Total is updated', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso", "Mocha"]);
    await headerView.navigateToTab("Cart page");
    await cartPage.removeCoffee("Espresso");

    await cartPage.assertTotal("8");
    await cartPage.assertCoffeeTotal("Mocha", "8");
});

test('Add two coffee, increase quantity in the cart: Check quantity is increased, Check Total is increased', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso", "Mocha"]);
    await headerView.navigateToTab("Cart page");
    await cartPage.changeCoffeeNumber("Mocha", true, 2);

    await cartPage.assertTotal("34");
    await cartPage.assertCoffeeTotal("Mocha", "24");
});

test('Add one coffee, increase quantity in the cart, go back to menu: Check quantity is saved, Check Total is saved', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso"]);
    await headerView.navigateToTab("Cart page");
    await cartPage.changeCoffeeNumber("Espresso", true, 1);
    await headerView.navigateToTab("Menu page");

    expect(await menuPage.getTotal()).toBe("Total: $20.00");
    expect(await menuPage.getOrderedCoffeeCount("Espresso")).toBe("2");
});

test('Add two coffee, submit order (valid email) in the cart: Check Success message, Check Total is 0, Check page is Menu', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso", "Mocha"]);
    await headerView.navigateToTab("Cart page");
    const paymentDetailsModal = await cartPage.clickTotalBtn();
    await paymentDetailsModal.submitOrder("Test User", "test@mail.com");

    expect(await menuPage.getSuccessMsg()).toBe("Thanks for your purchase. Please check your email for payment.");
    expect(await menuPage.getTotal()).toBe("Total: $0.00");
    await headerView.assertActiveTab("Menu page");
});

test('Add one coffee, open submit order, close submit order: Check Total not updated, Check page is cart', async ({page}) => {
    const menuPage = new MenuPage(page);
    const cartPage = new CartPage(page);
    const headerView = new HeaderView(page);

    await menuPage.navigateTo();
    await menuPage.addCoffeesToCart(["Espresso"]);
    await headerView.navigateToTab("Cart page");
    const paymentDetailsModal = await cartPage.clickTotalBtn();
    await paymentDetailsModal.closeSubmitDialog();

    expect(await menuPage.getTotal()).toBe("Total: $10.00");
    await headerView.assertActiveTab("Cart page");
});