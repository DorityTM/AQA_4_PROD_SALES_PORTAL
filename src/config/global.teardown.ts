import { NotificationService } from "utils/notifications/notifications.service";
import { TelegramService } from "utils/notifications/telegram.service";

export default async function () {
  if (!process.env.CI) return;

  const notificationService = new NotificationService(new TelegramService());
  const [owner, repoName] = process.env.GITHUB_REPOSITORY!.split("/");

  await notificationService.postNotification(`Test run finished!
    
Link to deployed report:

https://${owner}.github.io/${repoName}/allure-report/#`);
}
