import { Common_Locators } from "../Locators/Common_Locators";
class CartPage {

  // the method verify the cart page is open
  verifytheCartpageOpened() {
    cy.url().should("contains", "/cart.html")
    cy.get(Common_Locators.Cart_Page_locators.Cart_Page_title).should("have.text", "Your Cart")
    cy.log("Verified the Cart page Opened");

  }


  // verify remove  Product from cart
  VerifyAddedItemtoCart(Product_Name) {
    cy.get('body').then(($body) => {
      //product name css+jquery selector 
      const productElem = $body.find(`${Common_Locators.Cart_Page_locators.Product_Name_Cart}:contains("${Product_Name}")`);
      if (productElem.length > 0) {
        // Wrap the found element and click Add to Cart
        cy.wrap(productElem).parents(Common_Locators.Cart_Page_locators.Cart_Container).find(Common_Locators.Cart_Page_locators.Cart_Page_Remove_Btn).then(($el) => {
          let text = $el.text()
          expect(text).to.eq("Remove")
        })
        cy.log(`Remove button for product: ${Product_Name} is visible`);
      } else {
        cy.log(`Product not found: ${Product_Name}`);
      }
    });
  }
  //

  //remove  Product from cart
  RemoveItemfromCart(Product_Name) {
    cy.get('body').then(($body) => {
      //product name selector 
      const productElem = $body.find(`${Common_Locators.Cart_Page_locators.Product_Name_Cart}:contains("${Product_Name}")`);
      if (productElem.length > 0) {
        // Wrap the found element and click Add to Cart
        cy.wrap(productElem).parents(Common_Locators.Cart_Page_locators.Cart_Container).find(Common_Locators.Cart_Page_locators.Cart_Page_Remove_Btn).click({ force: true })
        cy.log(`product: ${Product_Name} removed form the cart`);
      } else {
        cy.log(`Product not found: ${Product_Name}`);
      }
    });
  }

  //click on checkout button
  clickOnCheckoutButton(){
    cy.get(Common_Locators.Cart_Page_locators.Checkout_Button).click({force:true})
    cy.wait(1000)
    cy.url().should("contains", "/checkout-step-one.html")
    cy.log("checkout Page opened")

  }
}
export const cartpage = new CartPage();
