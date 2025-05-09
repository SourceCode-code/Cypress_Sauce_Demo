import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let Locket_out_User
let ErrorText
describe("03_Verify_Lockout_user_failed_login", function () {


    beforeEach(function () {
        cy.fixture("Login_Data/03_Lockout_user.json").then((data) => {
            this.data = data
            Locket_out_User = this.data.Locket_out_User
            ErrorText = this.data.ErrorText
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //navigate to the url
        NavigationPage.navigateToUrl()

    })

    it("03_Verify_Lockout_user_failed_login", function () {
        //login with valid user
        NavigationPage.loginWithCredentials(Locket_out_User)
        //verify the home is visble 
        NavigationPage.verifyLoginErrorPopup(ErrorText)
    })
   

})
