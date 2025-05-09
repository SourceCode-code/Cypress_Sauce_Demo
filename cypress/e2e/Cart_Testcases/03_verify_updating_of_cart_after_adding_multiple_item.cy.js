import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"
import { cartpage } from "../../support/pageObjects/CartPage"

let User
let Bike_light
let Bagpack
describe("03_verify_updating_of_cart_after_adding_multiple_item", function () {

    beforeEach(function () {
        cy.fixture("Cart/03_Updating_of_cart_icon.json").then((data) => {
            this.data = data
            User = this.data.User
            Bike_light = this.data.Bike_light
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

    it("03_verify_updating_of_cart_after_adding_multiple_item", function () {

        //verify the  no item count added to cart 
        homepage.verifyCartIconQuantity(0)
        //add Sauce Labs Bike Light in the cart
        homepage.AddingItemtoCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        cy.wait(1000)
        //add Sauce Labs Backpack in the cart
        homepage.AddingItemtoCart(Bagpack)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(2)
        //click on the cart icon 
        homepage.ClickonCartBtn()
        //verify the product is added in to the cart 
        cartpage.verifytheCartpageOpened()
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bagpack)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(2)
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bike_light)
        //verify remove item button is visible for the same product
        homepage.verifyRemovefromCartButton(Bike_light)
        //verify remove item button is visible for the same product
        homepage.verifyRemovefromCartButton(Bagpack)
        //remove the item form the container 
        cartpage.RemoveItemfromCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //verify bike light  item not  present in the cart
        cartpage.VerifyAddedItemtoCart(Bike_light)
        //remove the item form the container 
        cartpage.RemoveItemfromCart(Bagpack)
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
