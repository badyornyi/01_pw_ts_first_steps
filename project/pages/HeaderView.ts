import { expect, Locator, Page } from "@playwright/test";

export class HeaderView{
    private readonly page: Page;
    private readonly tabLinkLctr = (tabName: string) => this.page.locator(`a[aria-label='${tabName}']`);
    private readonly activeTabLctr: Locator;

    constructor(page: Page){
        this.page = page;
        this.activeTabLctr = this.page.locator(`a.router-link-active`);
    }

    async navigateToTab(tabName: string){
        await this.tabLinkLctr(tabName).click();
        return this;
    }

    // Asserts

    async assertActiveTab(activeTab: string){
        expect(await this.activeTabLctr.getAttribute("aria-label")).toBe(activeTab);
    }
}