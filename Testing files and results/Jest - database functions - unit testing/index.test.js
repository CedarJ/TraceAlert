const { expect } = require('@jest/globals')
const dbFunctions = require('./index')
const validUserId = 'ALAVJ4WUwcdenKDhYXmaXMH9O2k1'

// setRiskyWeight(userId, weight)
test('Successfully set risky weight for a user', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.setRiskyWeight(validUserId, 1)
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith(`riskyWeight of user ${validUserId} successfully updated!`)
            res()
        }, 2000);
    })
})

test('Failed to set risky weight for a user - no userId being passed', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.setRiskyWeight()
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when setting risky weight: userId was not passed')
})

test('Failed to set risky weight for a user - the weight number is not passed', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.setRiskyWeight(validUserId)
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when setting risky weight: weight was not passed')
})

test('Failed to set risky weight for a user - wrong types of parameters being passed', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.setRiskyWeight(validUserId, '15')
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when setting risky weight: wrong types of parameters')
})

test('Failed to set risky weight for a user - the userId does not exist', async () => {
    console.log = jest.fn();
    dbFunctions.setRiskyWeight('aaaaaaa', 1)
    await new Promise(res => {
        setTimeout(() => {
            expect(console.log).toHaveBeenCalledWith("Error occurred when updating user's riskyWeight: Error: 5 NOT_FOUND: No document to update: projects/tracealert-94669/databases/(default)/documents/users/aaaaaaa")
            res()
        }, 2000);
    })
})

// getRiskyWeight()
test('Successfully return the risky weight of a user', () => {
    return dbFunctions.getRiskyWeight(validUserId).then(data => {
        expect(data).toEqual(1)
    })
})

test('Fail to return the risky weight of a user - invalid userId being passed', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    return dbFunctions.getRiskyWeight('aaaaaaaa').then(data => {
        expect(global.console.log).toHaveBeenCalledWith('This user does not exist')
    })
})

test('Fail to return the risky weight of a user - no userId being passed', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.getRiskyWeight()
    expect(global.console.log).toHaveBeenCalledWith('userId cannot be null')
})

test('Fail to return the risky weight of a user - wrong type of parameter', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.getRiskyWeight(12249593)
    expect(global.console.log).toHaveBeenCalledWith('userId is of invalid type')
})

// updateRiskStatus(userId, atRisk)
test('Successfully update the risky status of a user', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskStatus(validUserId, false)
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith(`Risk status of user ${validUserId} updated to: safe`)
            res()
        }, 2000);
    })
})

test('Fail to update the risky status of a user - the userId does not exist', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskStatus('aaaaaaaa', false)
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith("Error occurred when updating user's risk status: Error: 5 NOT_FOUND: No document to update: projects/tracealert-94669/databases/(default)/documents/users/aaaaaaaa")
            res()
        }, 2000);
    })
})

test('Fail to update the risky status of a user - no userId specified', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskStatus()
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk status: the userId is not specified')
})

test('Fail to update the risky status of a user - risk status is not specified', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskStatus(validUserId)
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk status: atRisk is not specified')
})

test('Fail to update the risky status of a user - arguments are of invalid types', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskStatus(12344, 'true')
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk status: arguments are of the wrong types')
})

// getRiskStatus(userId)
test('Successfully return the risk status of a user', () => {
    return dbFunctions.getRiskStatus(validUserId).then(data => {
        expect(data).toEqual(false)
    })
})

test('Fail to return the risk status of a user - the userId is not valid', () => {
    return dbFunctions.getRiskStatus('aaaaaaa').then().catch(err => {
        expect(err).toEqual("Error occurred when getting risk status: TypeError: Cannot read property 'atRisk' of undefined")
    })
})

test('Fail to return the risk status of a user - userId is not provided', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.getRiskStatus()
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk status: userId is not provided')
})

test('Fail to return the risk status of a user - userId is of the wrong type', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.getRiskStatus(12345)
    expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk status: userId is of the wrong type')
})

// updateRiskParameters(riskLevel, threshold, tiers)
test('Successfully update the risk parameters', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskParameters('low', 300, 3)
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith('Risk parameters successfully updated!')
            res()
        }, 2000);
    })
})

test('Update part of the risk parameters - lack of parameters', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskParameters('low')
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith('Risk level successfully updated!')
            res()
        }, 2000);
    })
    dbFunctions.updateRiskParameters('low', 300)
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith('Risk level and threshold successfully updated!')
            res()
        }, 2000);
    })
})

test('Fail to update the risk parameters - no parameters provided', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskParameters()
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith('No parameter specified')
            res()
        }, 2000)
    })
})

test('Fail to update the risk parameters - wrong types of arguments', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.updateRiskParameters('low', '300')
    await new Promise(res => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith('Error occurred when updating risk parameters: wrong types of arguments being passed')
            res()
        }, 2000);
    })
})

// getDirectContacts(userId)
test('Successfully get a list of contacts for user rvk3iUalM5Pp7SaxpM1nEBOzbqA2', async () => {
    return dbFunctions.getDirectContacts('rvk3iUalM5Pp7SaxpM1nEBOzbqA2').then(data => {
        expect(data).toEqual(["ALAVJ4WUwcdenKDhYXmaXMH9O2k1"])
    })
})

test('Fail to get a list of contacts for user - the userId does not exist', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    return dbFunctions.getDirectContacts('aaaaaa').then(() => {
        expect(console.log).toHaveBeenCalledWith('Error occurred when getting direct contacts: the userId does not exist')
    })
})

test('Fail to get a list of contacts for user - no userId provided', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    }
    dbFunctions.getDirectContacts()
    expect(console.log).toHaveBeenCalledWith('Error occurred when getting direct contacts: no userId provided')
})