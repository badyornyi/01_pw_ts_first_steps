import { expect, Locator, Page } from "@playwright/test";
import { PaymentModal } from "../modals/PaymentModal";

export class CartPage {
    private readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async navigateTo(){
        await this.page.goto("https://coffee-cart.netlify.app/cart");
        return this;
    }

    async changeCoffeeNumber(coffeeName: string, isIncrease: boolean, clickNumber: number){
        const addRemove = isIncrease ? "Add" : "Remove";
        const addRemoveLctr = this.page.locator(`ul:not([class='cart-preview']) button[aria-label="${addRemove} one ${coffeeName}"]`);
        for (let i: number = 0; i < clickNumber; i++) {
            await addRemoveLctr.click();
        }
        return this;
    }

    async removeCoffee(coffeeName: string){
        const removeLctr = this.page.locator(`button[aria-label="Remove all ${coffeeName}"]`);
        await removeLctr.click();
    }
    
    async clickTotalBtn(){
        const totalBtnLctr = this.page.locator("button.pay");
        await totalBtnLctr.click();
        return new PaymentModal(this.page);
    }

    // Assertions

    async assertHaveNoCoffeeMessage(){
        const noCoffeeMessageLctr = this.page.locator("div.list>p");
        expect(await noCoffeeMessageLctr.innerText()).toBe("No coffee, go add some.");
    }

    async assertTotal(total: string){
        const totalBtnLctr = this.page.locator("button[data-test='checkout']");
        expect(await totalBtnLctr.innerText()).toBe(`Total: $${total}.00`);
    }

    async assertCoffeeTotal(coffeeName: string, total: string){
        const coffeNameLctr = this.page.locator(`div:text-is("${coffeeName}")`);
        const totalLctr = this.page.locator(`li.list-item`, { has: coffeNameLctr }).locator("//div[3]");
        let totalValue: string = await totalLctr.innerText();
        expect(totalValue).toBe(`$${total}.00`);
    }
}