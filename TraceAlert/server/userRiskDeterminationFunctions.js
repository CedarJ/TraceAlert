function getriskyWeightCount(userId)
{
    var countacts = getDirectContacts(userId).then(value => {console.log(value)}).catch(err => {console.log(err)});  //get the list of Countacts uid
    var riskyWeightCount = 0;
    for (var i = 0; i < Contacts.length; i++)
    {
        var temp = getRiskyWeight(countacts[i]).then(value => {console.log(value)}).catch(err => {console.log(err)});
        riskyWeightCount += temp;
    }t
    return riskyWeightCount;  //return the accumulation of risky weight
}

//run every 24hr for every userId
function adjustRiskyWeight(userId)
{
    var riskyWeight = getRiskyWeight(userId).then(value => {console.log(value)}).catch(err => {console.log(err)});
    var riskstatus = getRiskStatus(userId).then(value => {console.log(value)}).catch(err => {console.log(err)});
    if (riskstatus)
    {
        setRiskyWeight(userId, (riskyWeight * 2));  //update risky weight by riskstatus coefficient
    }
    riskyWeight = getRiskyWeight(userId).then(value => {console.log(value)}).catch(err => {console.log(err)});
    riskyWeightCount = getriskyWeightCount(userId);
    if (riskyWeightCount >= 1000)
    {
        setRiskyWeight(userId, (riskyWeight * 2));  //update risky weight by special case coefficient
    }
}

function determineUserRisk(userId)
{
    var riskyWeightCount = getriskyWeightCount(userId);
    updateRiskStatus(userId, (riskyWeightCount >= 420));  //update risk status by the amount of risky weight count
}