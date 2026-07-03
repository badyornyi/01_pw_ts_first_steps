import { Locator, Page } from "@playwright/test";
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

    constructor(page: Page){
        this.page = page;
        this.totalBtnLctr = page.locator("button.pay");
        this.successMsgLctr = page.locator("div.success");
        this.promoLctr = page.locator("div.promo");
        this.promoTitleLctr = this.promoLctr.locator("span");
        this.promoYesLctr = this.promoLctr.getByRole("button", { name: "Yes, of course!" });
        this.promoNoLctr = this.promoLctr.getByRole("button", { name: "Nah, I'll skip." });
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
    }

    async addToCartByRmb(drinkName: string, add = true){
        const yesBtnLctr = this.page.getByRole("button", { name: "Yes" });
        const noBtnLctr = this.page.getByRole("button", { name: "No" });
        await this.cupLctr(drinkName).click({ button: "right" });
        if(add){
            await yesBtnLctr.click();
        }
        else{
            await noBtnLctr.click();
        }
    }

    async dblClickCoffeeTitle(drinkName: string){
        const cupTitleLctr = this.page.locator("li", { has: this.cupLctr(drinkName) }).locator("h4");
        await cupTitleLctr.dblclick();
    }

    async hoverTotalBtn(){
        await this.totalBtnLctr.hover();
    }

    async clickTotalBtn(){
        await this.totalBtnLctr.click();
        return new PaymentModal(this.page);
    }

    async getCoffeeTitleValue(drinkName: string){
        const cupTitleLctr = this.page.locator("li", { has: this.cupLctr(drinkName) }).locator("h4");
        return await cupTitleLctr.textContent();
    }

    async getTotal(){
        return await this.totalBtnLctr.innerText();
    }

    async getOrderedCoffeeCount(coffeeName: string){
        const coffeeCountLctr = this.page.locator(`//span[.='${coffeeName}']/../span[@class='unit-desc']`);
        return (await coffeeCountLctr.innerText()).replace(" x ", "");
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
        const cartPreviewLctr = this.page.locator(".cart-preview.show");
        const coffeeLineLctr = cartPreviewLctr.locator(`li:has-text('${drinkName}')`);
        //const decreaseCoffeeNumberLctr = coffeeLineLctr.getByRole("button", { name: "-" });
        const decreaseCoffeeNumberLctr = coffeeLineLctr.locator(`[aria-label='Remove one ${drinkName}']`);
        await decreaseCoffeeNumberLctr.click();
        return this;
    }
}