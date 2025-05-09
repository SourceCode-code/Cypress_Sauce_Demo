import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"
import { cartpage } from "../../support/pageObjects/CartPage"
import { checkout_page } from "../../support/pageObjects/CheckoutPage"
import { Datacells } from "../../support/interface"
import { Common_Locators } from "../../support/Locators/Common_Locators"

let User
let Bike_light, First_Name, Last_Name, Zip_Code;
let checkout_Info_Parameter
describe("02_verify_checkout_with_missing_firstname_fails.cy.js", function () {

    beforeEach(function () {
        cy.fixture("Checkout/02_missing_info_fail_purchase.json").then((data) => {
            this.data = data
            User = this.data.User
            Bike_light = this.data.Bike_light
            checkout_Info_Parameter = {
                [Common_Locators.Checkout_page_locators.lastname]: this.data.Last_Name,
                [Common_Locators.Checkout_page_locators.zip]: this.data.Zip_Code,
            }


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

    it("02_verify_checkout_with_missing_firstname_fails.cy.js", function () {

        //verify the  no item count added to cart 
        homepage.verifyCartIconQuantity(0)
        //add Sauce Labs Bike Light in the cart
        homepage.AddingItemtoCart(Bike_light)
        //click on the cart icon 
        homepage.ClickonCartBtn()
        //verify the product is added in to the cart 
        cartpage.verifytheCartpageOpened()
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //click on checkout button
        cartpage.clickOnCheckoutButton()
        //verify checkout page open
        checkout_page.verifytheCheckoutpageOpened()
        //enter your information for checkout
        checkout_page.enterDetailsforCheckout(checkout_Info_Parameter)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
        //click on Continue button
        checkout_page.clickOnContinueButton()
        //verify error is displayed 
        checkout_page.VerifyError_Pop_up()
        //verify Item Still added to cart 
        homepage.verifyCartIconQuantity(1)
        //verify still on checkout page 
        checkout_page.verifytheCheckoutpageOpened()


    })

    afterEach(() => {
        homepage.logout()
    })
})
