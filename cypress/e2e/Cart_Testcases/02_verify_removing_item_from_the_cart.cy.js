import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"
import { cartpage } from "../../support/pageObjects/CartPage"

let User
let Bike_light
describe("02_verify_removing_item_from_the_cart", function () {


    beforeEach(function () {
        cy.fixture("Cart/02_Removing_product_from_cart.json").then((data) => {
            this.data = data
            User = this.data.User
            Bike_light = this.data.Bike_light

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

    it("02_verify_removing_item_from_the_cart", function () {

        //add Sauce Labs Bike Light in the cart
        homepage.AddingItemtoCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //verify remove item button is visible for the same product
        homepage.verifyRemovefromCartButton(Bike_light)
        //click on the cart icon 
        homepage.ClickonCartBtn()
        //verify the product is added in to the cart 
        cartpage.verifytheCartpageOpened()
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //remove the item form the container 
        cartpage.RemoveItemfromCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(0)
        //verify no item present in the cart
        cartpage.VerifyAddedItemtoCart(Bike_light)
    })

    afterEach(() => {
        homepage.logout()
    })
})
