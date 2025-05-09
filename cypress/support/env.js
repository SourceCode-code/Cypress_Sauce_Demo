class ENV {
    //get the credentials
    getCredentials(type) {
       let credentials = {};
        //standard user 
        if (type === "standard_user") {
            credentials["username"] = "standard_user",
            credentials["password"] = "xjhwjy_xfzhj"
            return credentials;
        }
        //invalid user
        if (type === "locked_out_user") {
            credentials["username"] = "locked_out_user",
            credentials["password"] = "xjhwjy_xfzhj"
            return credentials;
        }
        //error_user
        if (type === "error_user") {
            credentials["username"] = "error_user",
            credentials["password"] = "xjhwjy_xfzhj"
            return credentials;
        }
         //invalid user
         if (type === "Invalid_user") {
            credentials["username"] = "standard_user",
            credentials["password"] = "xjhwjy_xfzhjjjs"
            return credentials;
        }
    }
}
export const env = new ENV()