class Common_Locators {
    //locators form the login page
    static Login_Page_Locators = {
        USER_NAME: '[id="user-name"]',
        PASSWORD: '[id="password"]',
        LOGIN_BTN: '[id="login-button"]',
        PAGE_TITLE: '[class="login_logo"]',
        LOGIN_ERROR_POPUP: 'h3[data-test="error"]'
    }

    //locators form the Home page
    static Home_Page_Locators = {
        HOME_LOGO: '[class="app_logo"]',
        Product_Container: '[class="inventory_item_description"]',
        Product_Name: '[class="inventory_item"] [class*="inventory_item_name"]',
        Add_To_Cart_Button: '[class="btn btn_primary btn_small btn_inventory "]',
        Cart_Quantity_Number: '[id="shopping_cart_container"] span',
        Cart_Icon: '[id="shopping_cart_container"] [class="shopping_cart_link"]',
        Remove_From_Cart: '[class="btn btn_secondary btn_small btn_inventory "]'

    }

    static Cart_Page_locators = {
        Cart_Page_title: '[class="title"]',
        Cart_Container: '[class="cart_item"]',
        Product_Name_Cart: '[class="inventory_item_name"]',
        Cart_Page_Remove_Btn: '[class="btn btn_secondary btn_small cart_button"]',
        Checkout_Button: '[id="checkout"]'

    }

    static LogOut = {
        sidebar: '[id="react-burger-menu-btn"]',
        Logout: '[id="logout_sidebar_link"]'
    }

    static Checkout_page_locators = {
        checkout_page_title:'[class="title"]',
        firstname: '[id="first-name"]',
        lastname: '[id="last-name"]',
        zip: '[id="postal-code"]',
        continue_btn: '[id="continue"]',
        cancel_btn: '[id="cancel"]',
        Finish_btn:'[id="finish"]',
        Product_in_Checkout:'[class="cart_item"] [class="inventory_item_name"]',
        Checkout_Product_Container:'[class="cart_item"]',
        Product_Price:'[class="inventory_item_price"]',
        Checkout_Summary_Product_Price:'[data-test="subtotal-label"]',
        Checkout_Summary_Tax_Price:'[data-test="tax-label"]',
        Checkout_Summary_Total_Price:'[data-test="total-label"]',
        Successful_purchase_text:'[class="complete-header"]',
        Error_Text:'[data-test="error"]'

    }

}
export { Common_Locators };