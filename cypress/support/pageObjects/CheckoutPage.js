import { Common_Locators } from "../Locators/Common_Locators";
import { Datacells } from "../interface";
class CheckoutPage {
    //method verifies checkout page opened
    verifytheCheckoutpageOpened() {
        cy.url().should("contains", "/checkout-step-one.html")
        cy.get(Common_Locators.Checkout_page_locators.checkout_page_title).should("have.text", "Checkout: Your Information")
        cy.log("Verified the checkout page Opened");

    }

    //method used to enter the information for checkout
    enterDetailsforCheckout(dataparameters) {
        for (const locator in dataparameters) {
            if (dataparameters[locator]) {
                cy.get(locator).type(dataparameters[locator]);
            }
        }
    }

    //click on continue button
    clickOnContinueButton() {
        cy.get(Common_Locators.Checkout_page_locators.continue_btn).click({ force: true });
        //  if Error message is present
        cy.get('body').then(($body) => {
            if ($body.find(Common_Locators.Checkout_page_locators.Error_Text).length > 0) {
                cy.get(Common_Locators.Checkout_page_locators.Error_Text)
                    .should('be.visible')
                    .and('contain.text', 'Error:');
                cy.log('Error: Please enter correct information');
            } else {
                // No error message
                cy.url().should('include', '/checkout-step-two.html');
                cy.log('Step 2 checkout page opened');
            }
        });
    }

    // method is used to click on the finish button
    clickOnFinishButton() {
        cy.get(Common_Locators.Checkout_page_locators.Finish_btn).click({ force: true })
        cy.wait(1000)
        cy.url().should("contains", "/checkout-complete.html")
        cy.log("Order Sucessfully Placed")

    }

    // verify the product present in the final checkout page
    VerifyProductNameAndPriceInFinalStep(Product_Name, Price) {
        cy.get('body').then(($body) => {
            //product name css+jquery selector 
            const productElem = $body.find(`${Common_Locators.Checkout_page_locators.Product_in_Checkout}:contains("${Product_Name}")`);
            if (productElem.length > 0) {
                // Wrap the found element and click Add to Cart
                cy.wrap(productElem).parents(Common_Locators.Cart_Page_locators.Cart_Container).find(Common_Locators.Checkout_page_locators.Product_Price).then(($el) => {
                    let text = $el.text()
                    expect(text).to.include(Price)
                })
                cy.log(`${Product_Name} is visible and the price is ${Price}`);
            } else {
                cy.log(`Product not found: ${Product_Name}`);
            }
        });
    }

    verifyTotalPriceToPay() {
        // get the item total
        cy.get(Common_Locators.Checkout_page_locators.Checkout_Summary_Product_Price).then((itemText) => {
            let ItemPriceText = itemText.text()
            const itemTotal = parseFloat(ItemPriceText.replace('Item total: $', '').trim());
            //get the tax price
            cy.get(Common_Locators.Checkout_page_locators.Checkout_Summary_Tax_Price)
                .then((taxText) => {
                    let TaxText = taxText.text()
                    const tax = parseFloat(TaxText.replace('Tax: $', '').trim());
                    // Calculate the total
                    const Total = parseFloat((itemTotal + tax).toFixed(2));
                    // Retrieve the displayed total
                    cy.get(Common_Locators.Checkout_page_locators.Checkout_Summary_Total_Price)
                        .then((totalText) => {
                            let Totalpr = totalText.text()
                            const displayedTotal = parseFloat(Totalpr.replace('Total: $', '').trim());
                            expect(displayedTotal).to.equal(Total);
                            cy.log(`Total price verified: $${displayedTotal}`);
                        });
                });
        });
    }

    //verify the purchase was success
    VerifyPurchase_Success() {
        cy.get(Common_Locators.Checkout_page_locators.Successful_purchase_text).should('be.visible').and('contain.text', 'Thank you for your order!')
    }

    //verify the error pop up is displayed
    VerifyError_Pop_up() {
        cy.get(Common_Locators.Checkout_page_locators.Error_Text).should("be.visible").and("contain.text", 'Error:')
        cy.log("Error Please enter Correct Information")
    }


       // method is used to click on the finish button
       clickOnCancelButton() {
        cy.get(Common_Locators.Checkout_page_locators.cancel_btn).click({ force: true })
        cy.wait(1000)
        cy.url().should("contains", "/cart.html")
        cy.log("  redirect Sucessfully to Cart Page")

    }
}
export const checkout_page = new CheckoutPage();
