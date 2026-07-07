import { expect, Locator, Page } from "@playwright/test";
import { PaymentModal } from "../modals/PaymentModal";

export class MenuPage {
    private readonly page: Page;
    private readonly totalBtnLctr: Locator;
    private readonly successMsgLctr: Locator;
    private readonly promoLctr: Locator;
    private readonly promoTitleLctr: Locator;
    private readonly promoYesLctr: Locator;
    private readonly promoNoLctr: Locator;
    private readonly cupLctr = (drinkName: string) => this.page.locator(`div.cup-body[aria-label='${drinkName}']`);
    private readonly yesBtnLctr: Locator;
    private readonly noBtnLctr: Locator;
    private readonly cupTitleLctr = (drinkName: string) => this.page.locator("li", { has: this.cupLctr(drinkName) }).locator("h4");
    private readonly coffeeCountLctr = (drinkName: string) => this.page.locator(`//span[.='${drinkName}']/../span[@class='unit-desc']`);
    private readonly cartPreviewLctr: Locator;
    private readonly coffeeLineLctr = (drinkName: string) => this.cartPreviewLctr.locator(`li:has-text('${drinkName}')`);
    private readonly decreaseCoffeeNumberLctr = (drinkName: string) => this.coffeeLineLctr(drinkName).locator(`[aria-label='Remove one ${drinkName}']`);

    constructor(page: Page){
        this.page = page;
        this.totalBtnLctr = this.page.locator("button.pay");
        this.successMsgLctr = this.page.locator("div.success");
        this.promoLctr = this.page.locator("div.promo");
        this.promoTitleLctr = this.promoLctr.locator("span");
        this.promoYesLctr = this.promoLctr.getByRole("button", { name: "Yes, of course!" });
        this.promoNoLctr = this.promoLctr.getByRole("button", { name: "Nah, I'll skip." });
        this.yesBtnLctr = this.page.getByRole("button", { name: "Yes" });
        this.noBtnLctr = this.page.getByRole("button", { name: "No" });
        this.cartPreviewLctr = this.page.locator(".cart-preview.show");
    }

    async navigateTo(){
        await this.page.goto("https://coffee-cart.netlify.app/");
        return this;
    }

    async addToCart(drinkName: string){
        await this.cupLctr(drinkName).click();
        return this;
    }

    async addCoffeesToCart(drinkNames: string[]){
        for(const drinkName of drinkNames){
            await this.addToCart(drinkName);
        }
        return this;
    }

    async addToCartByRmb(drinkName: string, add = true){
        await this.cupLctr(drinkName).click({ button: "right" });
        if(add){
            await this.yesBtnLctr.click();
        }
        else{
            await this.noBtnLctr.click();
        }
        return this;
    }

    async dblClickCoffeeTitle(drinkName: string){
        await this.cupTitleLctr(drinkName).dblclick();
        return this;
    }

    async hoverTotalBtn(){
        await this.totalBtnLctr.hover();
        return this;
    }

    async clickTotalBtn(){
        await this.totalBtnLctr.click();
        return new PaymentModal(this.page);
    }

    async getCoffeeTitleValue(drinkName: string){
        return await this.cupTitleLctr(drinkName).textContent();
    }

    async getTotal(){
        return await this.totalBtnLctr.innerText();
    }

    async getOrderedCoffeeCount(drinkName: string){
        return (await this.coffeeCountLctr(drinkName).innerText()).replace(" x ", "");
    }

    async getSuccessMsg(){
        return await this.successMsgLctr.innerText();
    }

    // promo

    async isPromoVisible(){
        return await this.promoLctr.isVisible();
    }

    async acceptPromo(){
        await this.promoYesLctr.click();
        return this;
    }

    async declinePromo(){
        await this.promoNoLctr.click();
        return this;
    }

    // cart pop-over

    async removeFromCart(drinkName: string){
        await this.decreaseCoffeeNumberLctr(drinkName).click();
        return this;
    }

    // Assertions

    async assertTotal(expectedTotal: string){
        expect(await this.getTotal()).toBe(expectedTotal);
    }

    async assertPromoIsVisible(expectedIsVisible: boolean){
        expect(await this.isPromoVisible()).toBe(expectedIsVisible);
    }

    async assertHasSuccessMsg(){
        expect(await this.getSuccessMsg()).toBe("Thanks for your purchase. Please check your email for payment.");
    }

    async assertDrinkTitle(drinkName: string, expectedDrinkTitle: string){
        expect(await this.getCoffeeTitleValue(drinkName)).toBe(expectedDrinkTitle);
    }
}