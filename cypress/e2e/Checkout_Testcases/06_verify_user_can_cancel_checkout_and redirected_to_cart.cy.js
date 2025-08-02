import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"
import { cartpage } from "../../support/pageObjects/cartPage"
import { checkout_page } from "../../support/pageObjects/CheckoutPage"
import { Datacells } from "../../support/interface"
import { Common_Locators } from "../../support/Locators/Common_Locators"
import { generateRandomData } from "../../support/pageObjects/GenerateRandomData"

let User
let Bike_light

let checkout_Info_Parameter

let First_Name = generateRandomData.genraterandomString(5, {includeUppercase:true,includeLowercase :true,includeNumbers :false,includeSymbols : false, excludeSimilar: true });
let Last_Name = generateRandomData.genraterandomString(5, {includeUppercase:true,includeLowercase :true,includeNumbers :false,includeSymbols : false, excludeSimilar: true });  
let Zip_Code = generateRandomData.genraterandomString(5, {includeUppercase:false,includeLowercase :false,includeNumbers :true,includeSymbols : false, excludeSimilar: true });  

describe("06_verify_user_can_cancel_checkout_and redirected_to_cart.cy.js", function () {

    beforeEach(function () {
        cy.fixture("Checkout/03_cancel_purcahse_redirect_to_cart.json").then((data) => {
            this.data = data
            User = this.data.User
            Bike_light = this.data.Bike_light
            checkout_Info_Parameter = {
                [Common_Locators.Checkout_page_locators.firstname]:First_Name,
                [Common_Locators.Checkout_page_locators.lastname]: Last_Name,
                [Common_Locators.Checkout_page_locators.zip]: Zip_Code,
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

    it("03_verify_user_can_cancel_checkout_and redirected_to_cart.cy.js", function () {

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
        //click on cancel button
        checkout_page.clickOnCancelButton()
        //verify the product is added in to the cart 
        cartpage.verifytheCartpageOpened()
        //verify the item is added to the cart 
        cartpage.VerifyAddedItemtoCart(Bike_light)
        //verify the item count added to cart 
        homepage.verifyCartIconQuantity(1)
    })

    afterEach(() => {
        homepage.logout()
    })
})
