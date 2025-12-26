import { expect, Locator } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class CommentsTab extends SalesPortalPage {
  readonly tab = this.page.locator('#comments[role="tabpanel"]');
  readonly uniqueElement = this.tab.locator("h4", { hasText: "Comments" });
  // form
  readonly textarea = this.tab.locator("#textareaComments");
  readonly error = this.tab.locator("#error-textareaComments");
  readonly createButton = this.tab.locator("#create-comment-btn");
  readonly deleteButtonSelector = this.tab.locator('button[name="delete-comment"][title="Delete"]');
  // cards
  readonly commentCards = this.tab.locator("div.shadow-sm.rounded.mx-3.my-3.p-3.border");
  readonly commentText = this.commentCards.locator("p.m-0");

  private cardText(card: Locator) {
    return card.locator(this.commentText);
  }

  private deleteButton(card: Locator) {
    return card.locator(this.deleteButtonSelector);
  }

  @logStep("CREATE BUTTON IS DISABLED")
  async expectCreateDisabled() {
    await expect(this.createButton).toBeDisabled();
  }

  @logStep("CREATE BUTTON IS ENABLED")
  async expectCreateEnabled() {
    await expect(this.createButton).toBeEnabled();
  }

  @logStep("TEXT AREA IS EMPTY")
  async expectTextareaEmpty() {
    await expect(this.textarea).toHaveValue("");
  }

  @logStep("FILL TEXT IN COMMENT")
  async fillComment(text: string) {
    await this.textarea.fill(text);
  }

  @logStep("CLICK CREATE BUTTON")
  async clickCreate() {
    await this.createButton.click();
  }

  //NEED TO ADD TO SERVICE
  @logStep("CREATE COMMENT")
  async createComment(text: string) {
    const before = await this.commentCards.count();
    await this.fillComment(text);
    await this.expectCreateEnabled();
    await this.clickCreate();
    await expect(this.commentCards).toHaveCount(before + 1);
    await expect(this.cardText(this.commentCards.first())).toHaveText(text);
    await this.expectTextareaEmpty();
    await this.expectCreateDisabled();
  }

  //NEED TO ADD TO SERVICE
  @logStep("DELETE ALL COMMENTS")
  async deleteAllComments() {
    while (await this.commentCards.count()) {
      const before = await this.commentCards.count();
      const firstCard = this.commentCards.first();
      await this.deleteButton(firstCard).click();
      await expect(this.commentCards).toHaveCount(before - 1);
    }
  }

  //NEED TO ADD TO SERVICE
  @logStep("DELETE ALL COMMENTS BY TEXT")
  async deleteCommentsByText(text: string) {
    let card = this.commentCards.filter({ has: this.commentText.filter({ hasText: text }) }).first();
    while (await card.count()) {
      const before = await this.commentCards.count();
      await this.deleteButton(card).click();
      await expect(this.commentCards).toHaveCount(before - 1);
      card = this.commentCards.filter({ has: this.tab.locator("p.m-0", { hasText: text }) }).first();
    }
  }
}
