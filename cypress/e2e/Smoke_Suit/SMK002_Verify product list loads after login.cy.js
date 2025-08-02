import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let User
describe("@smoke SMK002_Verify product list loads after login", function () {


    beforeEach(function () {
        cy.fixture("smoke_test_data/SMK002_Verify product list loads after login.json").then((data) => {
            this.data = data
            User = this.data.User

        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //navigate to the url
        NavigationPage.navigateToUrl()

    })

    it("SMK002_Verify product list loads after login @smoke", function () {
        //login with valid user
        NavigationPage.loginWithCredentials(User)
        //verify the home is visble 
        homepage.verifyHomepage()
        //verify the products page is opened and products are displayed
        homepage.verifyProductsPage()
        //verify minimum 6 products are displayed
        homepage.verifyMinimumProductsDisplayed(this.data.product_length)
    })
    afterEach(() => {
        homepage.logout()
    })
})
