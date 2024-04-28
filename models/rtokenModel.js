class rtokenModel{
    constructor({id, userId, token, expiresAt}){
        this.id = id || null;
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
    }
}

module.exports = rtokenModel;