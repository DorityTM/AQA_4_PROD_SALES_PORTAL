import { Page } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils.js";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class OrderDetailsCommentsTab extends SalesPortalPage {
  constructor(page: Page) {
    super(page);
  }

  readonly uniqueElement = this.page.locator("#comments-tab-container");
  readonly commentTextarea = this.page.locator("#textareaComments");
  readonly createButton = this.page.locator("#create-comment-btn");
  readonly deleteButton = this.page.locator("button[title='Delete']");
  readonly lastCreatedComment = this.uniqueElement.locator("div.shadow-sm").last();
  readonly lastCreatedCommentText = this.lastCreatedComment.locator("p");

  @logStep("ClICK CREATE COMMENT BUTTON")
  async clickCreate() {
    await this.createButton.click();
  }

  @logStep("ADD COMMENT")
  async addComment(comment: string) {
    await this.commentTextarea.fill(comment);
    await this.clickCreate();
  }
}
