export function setCookieValue(name, value) {
    // Create expiry data for cookie (1 day)
    let now = new Date();
    let time = now.getTime();
    let expiryTime = time + (1000 * 3600 * 24 * 1);
    now.setTime(expiryTime);
    // Create new cookie with expiry time & path
    let newCookie = `${name}=${value}; expires=${now.toUTCString()}; path=/;`;
    // Set cookie with newly created cookie
    document.cookie = newCookie;
}

// this function is used to get the value of a cookie by name (e.g. "UUID")
export function getCookieValue(name) {
    // Declare and initialize a dictionary
    let cookie = {};
    // Get cookie value
    let cookieString = document.cookie;
    cookieString.split(";").forEach(
        (element) => {
            let [key, value] = element.split("=");
            cookie[key.trim()] = value;
        }
    );
    return cookie[name];
}