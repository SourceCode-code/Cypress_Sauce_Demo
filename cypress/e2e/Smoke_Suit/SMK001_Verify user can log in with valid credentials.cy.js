import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let User
describe("SMK001_Verify user can log in with valid credentials", function () {


    beforeEach(function () {
        cy.fixture("smoke_test_data/SMK001_Verify user can log in with valid credentials.json").then((data) => {
            this.data = data
            User = this.data.User

        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //navigate to the url
        NavigationPage.navigateToUrl()

    })

    it("SMK001_Verify user can log in with valid credentials", function () {
        //login with valid user
        NavigationPage.loginWithCredentials(User)
        //verify the home is visble 
        homepage.verifyHomepage()
        //verify the products page is opened and products are displayed
        homepage.verifyProductsPage()
    })
    afterEach(() => {
        homepage.logout()
    })
})
