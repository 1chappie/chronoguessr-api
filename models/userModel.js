class userModel{
    constructor({id, username, hashedPassword, email, role, region}){
        this.id = id || null;
        this.role = role || 'user';
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.email = email;
        this.region = region;
    }
}

module.exports = userModel;