import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let Invalid_User
let ErrorText
describe("02_Verify_Invalid_Login_by_wrong_password", function () {


    beforeEach(function () {
        cy.fixture("Login_Data/02_Invalid_Login.json").then((data) => {
            this.data = data
            Invalid_User = this.data.Invalid_User
            ErrorText = this.data.ErrorText

        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //navigate to the url
        NavigationPage.navigateToUrl()

    })

    it("02_Verify_Invalid_Login_by_wrong_password", function () {
        //login with valid user
        NavigationPage.loginWithCredentials(Invalid_User)
        //verify the home is visble 
        NavigationPage.verifyLoginErrorPopup(ErrorText)
    })
})
