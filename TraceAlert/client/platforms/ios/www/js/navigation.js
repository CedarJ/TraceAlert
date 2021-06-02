let current_page = 0
let visited_page = 1
let qr_page = 2
let information_page = 3
let login_page = 4
let signup_page = 5
let home_page = 6

function pageTransition(page){
    removeOldPage(current_page)
    if (current_page == visited_page){
        document.querySelectorAll('.visited-location-container').forEach(n => n.remove())
    }
    current_page = page
    if (current_page == home_page || current_page == login_page || current_page == signup_page){
        document.getElementById('bottom-bar').style.display = 'none'
    } else {
        document.getElementById('bottom-bar').style.display = 'grid'
    }
    switch(page){
        case information_page:
        {
            toInformationPage()
            break
        }
        case visited_page:
        {
            toVisitedPage()
            break
        }
        case qr_page:
        {
            toQrPage()
            break
        }
        case login_page:
        {
            toLoginPage()
            break
        }
        case home_page:
        {
            toHomePage()
            break
        }
        case signup_page:
        {
            toSignupPage()
            break
        }
    }
}

function toLoginPage(){
    document.getElementById("login-page").style.display = "flex"
}

function toSignupPage(){
    document.getElementById('signup-page').style.display = "flex"
}

function toHomePage(){
    document.getElementById("homepage").style.display = "flex"
}

function toInformationPage(){
    // set button colour
    document.getElementById("information-page-button").classList.add('selected-button')
    // set visible
    document.getElementById('information-page').style.display = "flex"
    // set information
    getUserInfo()
    .then(info => {
        console.log(info.firstname)
        document.getElementById('username').innerHTML = info.firstname + ' ' + info.surname
        document.getElementById('birth').innerHTML = info.dateOfBirth.getFullYear() + '-' + (info.dateOfBirth.getMonth() + 1) + '-' + info.dateOfBirth.getDate()
        document.getElementById('phone').innerHTML = info.phone
        document.getElementById('email').innerHTML = info.email
        document.getElementById('address').innerHTML = info.address + ", " + info.city + ", " + info.state + ", " + info.postalCode
    })
    .catch(err => console.log(err))
}

function toVisitedPage(){
    // set button colour
    document.getElementById("visited-page-button").classList.add('selected-button')
    // set visible
    document.getElementById('visited-page').style.display = "flex"
    // fill out information
    let today = new Date()
    let startingDate = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000))
    document.getElementById('visited-locations-since-date').innerHTML = "since " + startingDate.getFullYear() + '-' + (startingDate.getMonth()+1) + '-' + startingDate.getDate()
    getContactCount().then(count => {
        document.getElementById('people-count').innerHTML = 'Total number of people met: ' + count
    })
    getContacts().then(data => {
        document.getElementById('places-count').innerHTML = 'Total number of places visited: ' + data.length
        for (let i = 0; i < data.length; i++)
            createVisitedLocationEntry(data[i])
    })
}

function createVisitedLocationEntry(location){
    console.log(location)
    let container = document.createElement('div')
    container.classList.add('visited-location-container')

    let containerLeft = document.createElement('div')
    containerLeft.classList.add('location-left')
    let nameContainer = document.createElement('div')
    nameContainer.innerHTML = location.locationInfo.name
    nameContainer.classList.add('name-container')

    let dateContainer = document.createElement('div')
    let time = location.contact[location.contact.length-1].time
    dateContainer.innerHTML = "Last visit: " + time.toDate().toLocaleString()
    dateContainer.classList.add('date-container')

    containerLeft.appendChild(nameContainer)
    containerLeft.appendChild(dateContainer)

    let countContainer = document.createElement('div')
    countContainer.innerHTML = location.contact.length
    countContainer.classList.add('count-container')

    let iconContainer = document.createElement('div')
    iconContainer.classList.add('icon-container')
    let icon = document.createElement('span')
    icon.classList.add('material-icons')
    icon.innerHTML = 'arrow_forward_ios'
    iconContainer.appendChild(icon)
    
    container.appendChild(containerLeft)
    container.appendChild(countContainer)
    container.appendChild(iconContainer)

    container.onclick = () => {
        console.log('Go to detailed page...')
        gotoDetailPage(location)
    }

    let visitedBody = document.getElementById('visited-body')
    visitedBody.appendChild(container)
}

function toQrPage(){
    // set button colour
    document.getElementById("qr-page-button").classList.add('selected-button')
    // set visible
    document.getElementById('qr-page').style.display = "flex"
    // fill out information
    let date = new Date()
    document.getElementById('risk-update-date').innerHTML = "Updated on "+ date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    
    document.getElementById('qr-code').src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + currentUser.uid.substring(0, 10)

    getRiskStatus().then(risk => {
        if (risk){
            document.getElementById('risk-indication').innerHTML = 'Warning: you have direct/indirect contact with people who are at risk for exposure to COVID-19.'
            document.getElementById('risk-indication').color = "red"
        } else {
            document.getElementById('risk-indication').innerHTML = 'You are currently not at risk for exposure to COVID-19. Stay strong and stay safe!'
        }
    })
    
}

function removeOldPage(page){
    switch(page){
        case visited_page:
        {
            document.getElementById('visited-page-button').classList.remove('selected-button')
            document.getElementById('visited-page').style.display = "none"
            break;
        }
        case qr_page:
        {
            document.getElementById('qr-page-button').classList.remove('selected-button')
            document.getElementById('qr-page').style.display = "none"
            break
        }
        case information_page:
        {
            document.getElementById('information-page-button').classList.remove('selected-button')
            document.getElementById('information-page').style.display = "none"
            break
        }
        case login_page:
        {
            document.getElementById('login-page').style.display = "none"
            break
        }
        case home_page:
        {
            console.log('hhhh')
            document.getElementById('homepage').style.visibility = 'hidden'
            console.log(document.getElementById('homepage').style.display)
            break
        }
        case signup_page:
        {
            document.getElementById('signup-page').style.display = "none"
            break
        }
    }
}

function gotoEditInfoPage(){
    console.log('Go to information editting page')
    document.getElementById('detail-page').style.display = "none"
    document.getElementById('page-on-top').style.display = "flex"
    document.getElementById('edit-page').style.display = 'flex'
    // fill out information
    getUserInfo().then(info => {
        document.getElementById('firstname-edit').value = info.firstname
        document.getElementById('lastname-edit').value = info.surname
        let dateOfBirth = info.dateOfBirth.getFullYear() + '-' + (info.dateOfBirth.getMonth()+1) + '-' + info.dateOfBirth.getDate()
        document.getElementById('birth-edit').value = dateOfBirth
        document.getElementById('phone-edit').value = info.phone
        document.getElementById('email-edit').value = info.email
        document.getElementById('address-edit').value = info.address
        document.getElementById('city-edit').value = info.city
        document.getElementById('state-edit').value = info.state
        document.getElementById('postalCode-edit').value = info.postalCode
    })
}

function gotoDetailPage(location){
    document.getElementById('edit-page').style.display = "none"
    document.getElementById('page-on-top').style.display = "flex"
    document.getElementById('detail-page').style.display = 'flex'
    // fill out information
    document.getElementById('address-container').innerHTML = location.locationInfo.name + ', ' + location.locationInfo.city + ', ' + location.locationInfo.state
    let contact = location.contact
    for (let i = 0; i < contact.length; i++){
        createDetailContainer(contact[i])
    }
}

function createDetailContainer(info){
    let container = document.createElement('div')
    container.id = "detailed-info"
    container.classList.add('visited-location-container')

    let containerLeft = document.createElement('div')
    containerLeft.classList.add('location-left')
    let nameContainer = document.createElement('div')
    nameContainer.innerHTML = info.preciseLocation.length == 0 ? 'n/a' : info.preciseLocation
    nameContainer.classList.add('name-container')

    let dateContainer = document.createElement('div')
    dateContainer.innerHTML = info.time.toDate().toLocaleString()
    dateContainer.classList.add('date-container')

    containerLeft.appendChild(nameContainer)
    containerLeft.appendChild(dateContainer)

    
    container.appendChild(containerLeft)


    let detailContainer = document.getElementById('detail-container')
    detailContainer.appendChild(container)
}

function goBack(){
    document.getElementById('page-on-top').style.display = "none"
    document.querySelectorAll('#detailed-info').forEach(n => n.remove())
}