import { expect, Page } from "@playwright/test";

export class HeaderView{
    private readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async navigateToTab(tab: string){
        const tabLinkLctr = this.page.locator(`a[aria-label='${tab}']`);
        await tabLinkLctr.click();
        return this;
    }

    async assertActiveTab(activeTab: string){
        const activeTabLctr = this.page.locator(`a.router-link-active`);
        expect(await activeTabLctr.getAttribute("aria-label")).toBe(activeTab);
    }
}