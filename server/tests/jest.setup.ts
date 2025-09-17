import { jest } from "@jest/globals";
import { EmailService } from "../src/services/EmailService";

jest.spyOn(EmailService, "sendEmail").mockImplementation(async () => {
  return Promise.resolve();
});
