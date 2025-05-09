import { Common_Locators } from "../Locators/Common_Locators";
import { crypt } from "../encryption"
import { env } from "../env"

class navigationPage {


  navigateToUrl() {
    let baseURL = Cypress.env("baseURL");
    cy.visit(baseURL);
    cy.get(Common_Locators.Login_Page_Locators.PAGE_TITLE)
      .should("be.visible")
      .and("contain.text", "Swag Labs", { timeout: 5000 });
    cy.log("✅ Visited the Swag Labs website");
  }

  loginWithCredentials(type) {
    const credentials = env.getCredentials(type);
    const decodedPassword = crypt.decode(credentials.password);

    // Enter fields
    cy.get(Common_Locators.Login_Page_Locators.USER_NAME).clear().type(credentials.username, { log: false });
    cy.get(Common_Locators.Login_Page_Locators.PASSWORD).clear().type(decodedPassword, { log: false });
    cy.get(Common_Locators.Login_Page_Locators.LOGIN_BTN).click({ force: true });

    cy.get('body').then(($body) => {
      if ($body.find(Common_Locators.Home_Page_Locators.HOME_LOGO).length > 0) {
        cy.get(Common_Locators.Home_Page_Locators.HOME_LOGO, { timeout: 10000 }).should('be.visible');
        cy.log(`Login successful for ${type}`);
      } else {
        cy.get(Common_Locators.Login_Page_Locators.LOGIN_ERROR_POPUP, { timeout: 5000 }).should('be.visible');
        cy.log(`Login failed`);
      }
    });
  }


  verifyLoginErrorPopup(ErrorText) {
    cy.get(Common_Locators.Login_Page_Locators.LOGIN_ERROR_POPUP, { timeout: 5000 }).should("be.visible").and("contain.text", ErrorText)
  }


}
export const NavigationPage = new navigationPage();