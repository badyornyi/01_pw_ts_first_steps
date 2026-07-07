import { expect, Locator, Page } from "@playwright/test";
import { PaymentModal } from "../modals/PaymentModal";

export class CartPage {
    private readonly page: Page;
    private readonly addRemoveLctr = (addRemove: string, drinkName: string) => this.page.locator(`ul:not([class='cart-preview']) button[aria-label="${addRemove} one ${drinkName}"]`);
    private readonly removeDrinkLctr = (drinkName: string) => this.page.locator(`button[aria-label="Remove all ${drinkName}"]`);
    private readonly totalBtnLctr: Locator;
    private readonly noCoffeeMessageLctr: Locator;
    private readonly drinkNameLctr = (drinkName: string) => this.page.locator(`div:text-is("${drinkName}")`);
    private readonly totalLctr = (drinkName: string) => this.page.locator(`li.list-item`, { has: this.drinkNameLctr(drinkName) }).locator("//div[3]");

    constructor(page: Page){
        this.page = page;
        this.totalBtnLctr = this.page.locator("button.pay");
        this.noCoffeeMessageLctr = this.page.locator("div.list>p");
    }

    async navigateTo(){
        await this.page.goto("https://coffee-cart.netlify.app/cart");
        return this;
    }

    async changeCoffeeNumber(drinkName: string, isIncrease: boolean, clickNumber: number){
        const addRemove = isIncrease ? "Add" : "Remove";
        for (let i: number = 0; i < clickNumber; i++) {
            await this.addRemoveLctr(addRemove, drinkName).click();
        }
        return this;
    }

    async removeCoffee(drinkName: string){
        await this.removeDrinkLctr(drinkName).click();
        return this;
    }
    
    async clickTotalBtn(){
        await this.totalBtnLctr.click();
        return new PaymentModal(this.page);
    }

    // Assertions

    async assertHaveNoCoffeeMessage(){
        expect(await this.noCoffeeMessageLctr.innerText()).toBe("No coffee, go add some.");
    }

    async assertTotal(total: string){
        expect(await this.totalBtnLctr.innerText()).toBe(`Total: $${total}.00`);
    }

    async assertCoffeeTotal(drinkName: string, total: string){
        expect(await this.totalLctr(drinkName).innerText()).toBe(`$${total}.00`);
    }
}