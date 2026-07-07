import { expect, Locator, Page } from "@playwright/test";

export class PaymentModal {
    private readonly page: Page;
    private readonly paymentModalLctr: Locator;
    private readonly closePaymentModal: Locator;
    private readonly nameInputLctr: Locator;
    private readonly emailInputLctr: Locator;
    private readonly submitBtnLctr: Locator;

    constructor(page: Page){
        this.page = page;
        this.paymentModalLctr = page.locator("div.modal");
        this.closePaymentModal = this.paymentModalLctr.locator("button.close");
        this.nameInputLctr = this.paymentModalLctr.locator("#name");
        this.emailInputLctr = this.paymentModalLctr.locator("#email");
        this.submitBtnLctr = this.paymentModalLctr.locator("#submit-payment");
    }

    async submitOrder(name: string, email: string){
        await this.fillName(name);
        await this.fillEmail(email);
        await this.clickSubmitBtn();
    }

    async isDialogOpened(){
        return await this.closePaymentModal.isVisible();
    }

    async closeSubmitDialog(){
        return await this.closePaymentModal.click();
    }

    private async fillName(name: string){
        await this.nameInputLctr.fill(name);
    }

    private async fillEmail(email: string){
        await this.emailInputLctr.fill(email);
    }

    private async clickSubmitBtn(){
        await this.submitBtnLctr.click();
    }

    // Assertions

    async assertDialogIsOpened(expectedIsOpened: boolean){
        expect(await this.isDialogOpened()).toBe(expectedIsOpened);
    }
}