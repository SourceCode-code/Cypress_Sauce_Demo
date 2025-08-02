import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"
import { cartpage } from "../../support/pageObjects/CartPage"

let User
let Bagpack
describe("@smoke SMK003_Verify user can add a product to cart", function () {


    beforeEach(function () {
        cy.fixture("smoke_test_data/SMK003_Verify user can add a product to cart.json").then((data) => {
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

    it("SMK003_Verify user can add a product to cart @smoke", function () {

        //add Sauce Labs Backpack in the cart
        homepage.AddingItemtoCart(Bagpack)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //verify remove item button is visible for the same product
        homepage.verifyRemovefromCartButton(Bagpack)
        //click on the cart icon 
        homepage.ClickonCartBtn()
        //verify the product is added in to the cart 
        cartpage.verifytheCartpageOpened()
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bagpack)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
    })

    afterEach(() => {
        homepage.logout()
    })
})
