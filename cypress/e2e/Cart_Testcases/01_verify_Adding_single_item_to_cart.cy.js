import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let User
let Bagpack
describe("01_verify_Adding_single_item_to_cart", function () {


    beforeEach(function () {
        cy.fixture("Cart/01_Adding_product_to_cart.json").then((data) => {
            this.data = data
            User = this.data.User
            Bagpack = this.data.Bagpack

        }).then(() => {
            cy.clearCookies()
            cy.clearLocalStorage()
            //navigate to the url
            NavigationPage.navigateToUrl()
            //login with valid user
            NavigationPage.loginWithCredentials(User)
            //verify the home is visble 
            homepage.verifyHomepage()
        })
    })

    it("01_verify_Adding_single_item_to_cart", function () {

        //add Sauce Labs Backpack in the cart
        homepage.AddingItemtoCart(Bagpack)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //verify remove item button is visible for the same product
        homepage.verifyRemovefromCartButton(Bagpack)
    })

    afterEach(() => {
        homepage.logout()
    })
})
