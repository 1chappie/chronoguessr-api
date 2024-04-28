const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const userDAO = require('../dao/userDAO.js');

const validationService = require('./validationService.js');

exports.create = async (username, password, email, region) => {
    console.log("Creating user: ", username, password, email, region);
    validationService.user.email(email);
    validationService.user.username(username);
    validationService.user.region(region);
    const user = new userModel({
        username: username,
        hashedPassword: bcrypt.hashSync(password, 10),
        email: email,
        region: region
    });
    console.log("Validated user: ", user);
    const createdUser = await userDAO.create(user);
    if (!createdUser) throw new Error("Could not create user. Username or email may already be in use.");
    return createdUser;
}

exports.getOne = async (identifier) => {
    const user = await userDAO.readOneByUsernameOrEmail(identifier);
    if (!user) throw new Error("User not found.");
    return user;
}

exports.get = async () => {
    return await userDAO.read();
}

exports.updatePassword = async (identifier, password) => {
    const user = await userDAO.readOneByUsernameOrEmail(identifier);
    if (!user) throw new Error("User not found");
    user.hashedPassword = bcrypt.hashSync(password, 10);
    const s = await userDAO.update(user);
    if (!s) throw new Error("Could not update password.");
    return user;
}

exports.updateEmail = async (identifier, email) => {
    validationService.user.email(email);
    const user = await userDAO.readOneByUsernameOrEmail(identifier);
    if (!user) throw new Error("User not found");
    user.email = email;
    const s = await userDAO.update(user);
    if (!s) throw new Error("Could not update email, email may already be in use.");
    return user;
}

exports.updateRegion = async (identifier, region) => {
    validationService.user.region(region);
    const user = await userDAO.readOneByUsernameOrEmail(identifier);
    if (!user) throw new Error("User not found");
    user.region = region;
    const s = await userDAO.update(user);
    if (!s) throw new Error("Could not update region.");
    return user;
}

exports.delete = async (identifier) => {
    const s = await userDAO.deleteByUsernameOrEmail(identifier);
    if (!s) throw new Error("Could not delete user.");
    return true;
}

exports.validatePassword = async (identifier, pass) => {
    const user = await userDAO.readOneByUsernameOrEmail(identifier);
    if (!user) throw new Error("User not found.");
    if (!bcrypt.compareSync(pass, user.hashedPassword))
        throw new Error("Invalid password.");
    return user;
}
