exports.user = {
    email(email) {
        if (email.length < 3 || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Invalid email");
        }
    },
    username(username) {
        if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9]+$/.test(username) ) {
            throw new Error("Invalid username");
        }
    },
    region(region) {
        if (!["NA", "SA", "EU", "AS", "AF", "OC"].includes(region)) {
            throw new Error("Invalid region");
        }
    }
}