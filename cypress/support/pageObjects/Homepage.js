import { Common_Locators } from "../Locators/Common_Locators";
class Homepage {

    verifyHomepage() {
        cy.url().should("contains", "/inventory.html")
        cy.title().should("eq", "Swag Labs")
        cy.log("Verified the Homepage is Opened");

    }


    // Add to Product to cart
    AddingItemtoCart(Product_Name) {
        cy.get('body').then(($body) => {
            //product name selector 
            const productElem = $body.find(`${Common_Locators.Home_Page_Locators.Product_Name}:contains("${Product_Name}")`);
            console.log(productElem)
            if (productElem.length > 0) {
                // Wrap the found element and click Add to Cart
                cy.wrap(productElem).parents(Common_Locators.Home_Page_Locators.Product_Container).find(Common_Locators.Home_Page_Locators.Add_To_Cart_Button).click({ force: true });
                cy.log(`Clicked Add to Cart for product: ${Product_Name}`);
            } else {
                cy.log(`Product not found: ${Product_Name}`);
            }
        });
    }

    //this method verifies the number of item present in the cart 
    verifyCartIconQuantity(expectedCount) {
        if (expectedCount > 0) {
            cy.get(Common_Locators.Home_Page_Locators.Cart_Quantity_Number, { timeout: 10000 }).should('be.visible').then(text => {
                const Text = Number(text.text().trim())
                expect(Text).to.eq(expectedCount);
            });
            cy.log(`Cart count is ${expectedCount}`);
        }
        if (expectedCount == 0) {
            cy.get(Common_Locators.Home_Page_Locators.Cart_Quantity_Number, { timeout: 10000 }).should('not.exist')
            cy.log('NO Cart icon badge');
        }
    }

    //verify remove item btn visible form the same element 
    verifyRemovefromCartButton(Product_Name) {
        cy.get('body').then(($body) => {
            //product name selector 
            const productElem = $body.find(`${Common_Locators.Home_Page_Locators.Product_Name}:contains("${Product_Name}")`);
            if (productElem.length > 0) {
                // Wrap the found element and click Add to Cart
                cy.wrap(productElem).parents(Common_Locators.Home_Page_Locators.Product_Container).find(Common_Locators.Home_Page_Locators.Remove_From_Cart).then(($el) => {
                    let text = $el.text()
                    expect(text).to.eq("Remove")
                })
                cy.log(`Remove button for product: ${Product_Name} is visible`);
            }
        });
    }


    //click on the cart icon 
    ClickonCartBtn() {
        cy.get(Common_Locators.Home_Page_Locators.Cart_Icon).click({ force: true });
        cy.wait(500)
        cy.url().should("contains", "/cart.html")
        cy.log("The Cart Window is opened")
    }

    //logout
    logout() {
        cy.get(Common_Locators.LogOut.sidebar).click({ force: true })
        cy.get(Common_Locators.LogOut.Logout).should("have.text", "Logout")
        cy.get(Common_Locators.LogOut.Logout).click({ force: true })
        cy.log(`Logged Out`)
    }
}
export const homepage = new Homepage();