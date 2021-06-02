const { expect } = require('@jest/globals')
const myFirebase = require('./firebase')


test('Fail to create a new user - insufficient number of parameters', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.createNewUser()
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when creating the account: no parameter is passed')
})

test('Fail to create a new user -  wrong type of parameter', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.createNewUser(17)
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when creating the account: wrong type of parameter')
})

test('Fail to create a new user - the object does not contain enough information', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.createNewUser({
        firstname: "Jane",
        surname: "Doe",
        phone: "123456789",
        email: "jane_doe@gmail.com",
        city: "Adelaide",
        state: "SA",
        postalCode: "5000",
    })
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when creating the account: insufficient information in the object')
})


test('Failed to login - wrong email address or password', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login('a1770710@student.adelaide.edu.au', '111111')
    setTimeout(() => {
        expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in')
    }, 3000);
})

test('Failed to login - wrong email address', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login('a1777777@student.adelaide.edu.au', '123456')
    setTimeout(() => {
        expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in')
    }, 3000);
})

test('Failed to login - wrong password', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login('a1770710@student.adelaide.edu.au', '111111')
    setTimeout(() => {
        expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in')
    }, 3000);
})

test('Failed to login - email address not provided', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login()
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in: email was not provided')
})

test('Failed to login - password address not provided', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login('a1770710@student.adelaide.edu.au')
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in: password was not provided')
})

test('Failed to login - wrong types of parameters provided', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    myFirebase.login('a1770710@student.adelaide.edu.au', 55555)
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when logging in: wrong types of parameters provided')
})
