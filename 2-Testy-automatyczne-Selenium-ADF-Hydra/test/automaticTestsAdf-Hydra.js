require('chromedriver');
const { By } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
var path = require("path");
const assert = require('assert')
var should = require("chai").should()

//automatycznie dodana dzisiejsza data, tydzień do przodu i tydzień do tyłu
var weekahead = new Date()
var weekbehind = new Date()
var today = new Date()
weekahead.setDate(weekahead.getDate() + 7)
weekbehind.setDate(weekbehind.getDate() - 7)
var aDay = `${weekahead.getDate()}`
var aMonth = `${weekahead.getMonth()+1}`
var bDay = `${weekbehind.getDate()}`
var bMonth = `${weekbehind.getMonth()+1}`
var tDay = `${today.getDate()}`
var tMonth = `${today.getMonth()+1}`
if(weekahead.getDate()<10) aDay=`0${weekahead.getDate()}`
if((weekahead.getMonth()+1)<10) aMonth=`0${weekahead.getMonth()+1}`
if(weekbehind.getDate()<10) bDay=`0${weekbehind.getDate()}`
if((weekbehind.getMonth()+1)<10) bMonth=`0${weekbehind.getMonth()+1}`
if(today.getDate()<10) tDay=`0${today.getDate()}`
if((today.getMonth()+1)<10) tMonth=`0${today.getMonth()+1}`

//automatycznie określane ścieżki główne do przykładowych plików pdf
var absolutePathPdf1 = path.resolve("./przykladowy-pdf/Przykladowy-pdf-1.pdf").replaceAll("\\", "/")
var absolutePathPdf2 = path.resolve("./przykladowy-pdf/Przykladowy-pdf-2.pdf").replaceAll("\\", "/")
var absolutePathPdf3 = path.resolve("./przykladowy-pdf/Przykladowy-pdf-3.pdf").replaceAll("\\", "/")
var absolutePathPdf4 = path.resolve("./przykladowy-pdf/Przykladowy-pdf-4.pdf").replaceAll("\\", "/")

//dane do sprawdzonych testów 2 tyg do tylu
var twoWeekbehind = new Date()
twoWeekbehind.setDate(twoWeekbehind.getDate() - 14)
var twoBDay = `${twoWeekbehind.getDate()}`
var twoBMonth = `${twoWeekbehind.getMonth()+1}`
if(twoWeekbehind.getDate()<10) twoBDay=`0${twoWeekbehind.getDate()}`
if((twoWeekbehind.getMonth()+1)<10) twoBMonth=`0${twoWeekbehind.getMonth()+1}`

//dane do sprawdzonych testów 2 tygodnie do przodu
var twoWeekahead = new Date()
twoWeekahead.setDate(twoWeekahead.getDate() + 14)
var twoADay = `${twoWeekahead.getDate()}`
var twoAMonth = `${twoWeekahead.getMonth()+1}`
if(twoWeekahead.getDate()<10) twoADay=`0${twoWeekahead.getDate()}`
if((twoWeekahead.getMonth()+1)<10) twoAMonth=`0${twoWeekahead.getMonth()+1}`

//dane do sprawdzenia dzisiaj
var tHour = today.getHours()
var tMinutes = today.getMinutes()
if(tHour<10) tHour=`0${tHour}`
if(tMinutes<10) tHour=`0${tMinutes}`


clients = [
    {nameC: "Monika", lastName: "Papiez", address: "Głowackiego 20, Mielec", phone: "987654321", nameOfService: "Montaż kotła", placeOfAssembly: "Głowackiego 2, Mielec", dateOfService: `${aDay}.${aMonth}.${weekahead.getFullYear()}`, dateOfServiceH: "10:00", DateNextInspection: `${aDay}.${aMonth}.${weekahead.getFullYear()+1}`},
    {nameC: "Adam", lastName: "Marzec", address: "Głowackiego 25, Mielec", phone: "666555999", nameOfService: "Serwis kotła", placeOfAssembly: "Głowackiego 25, Mielec", dateOfService: `${bDay}.${bMonth}.${weekbehind.getFullYear()}`, dateOfServiceH: "16:00", DateNextInspection: `${tDay}.${tMonth}.${today.getFullYear()}`}
]

tasksForFirstClient = [
    {nameOfService: "Kalibracja kotła", placeOfAssembly: "Głowackiego 20, Mielec", dateOfService: `${tDay}.${tMonth}.${today.getFullYear()}`, dateOfServiceH: "23:59", DateNextInspection: `${aDay}.${aMonth}.${weekahead.getFullYear()}`},
    {nameOfService: "Wymiana kondensatora", placeOfAssembly: "Głowackiego 20, Mielec", dateOfService: `${tDay}.${tMonth}.${today.getFullYear()}`, dateOfServiceH: "00:01", DateNextInspection: `${aDay}.${aMonth}.${weekahead.getFullYear()}`}
]

//id dodanych klientow
var addClientsID = []
//id dodanych automatycznie zadań do klientow widocznych wyżej
var firstAddedTasksID = []

//id zadań dodanych do klienta pierwszego
var tasksIDAddedToFirstClient = []


// describe block
describe("Testing add clients, tasks and login to application", function(){

    //it blocks
    it("Login to page", async function(){

        var login = "dawid15"
        var password = "qwerty"

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/logowanie');

        await driver.findElement(By.id("login")).sendKeys(`${login}`)
        await driver.findElement(By.id("password")).sendKeys(`${password}`, webdriver.Key.RETURN)


        var body_after_login = await driver.wait(webdriver.until.elementLocated(By.className('a-nav'))).getText().then(function(values){
            return values
        })

        if(body_after_login.should.equal(`${login}`)){
            console.log('zalogowano sie pomyslnie')
        }

        // driver.sleep(5000)
        await driver.quit()
    })

    //---------------------------------------------------------------------------------------------------------------------

    it("Click buttons Klienci -> Dodaj klienta", async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna');
        await driver.findElement(By.className('customers-button')).click()
        await driver.wait(webdriver.until.elementLocated(By.className('addCustomers-button'))).click()

        // driver.sleep(5000)
        await driver.quit()
    })

    // ---------------------------------------------------------------------------------------------------------------------

    var loopIteration = 0
    clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

        it(`Add client: ${nameC} ${lastName}`, async function(){

         var driver = new webdriver.Builder()
                .forBrowser('chrome')
                .build();

            await driver.get('http://localhost:3000/strona_glowna/dodaj_klienta');

            await driver.findElement(By.id('name')).sendKeys(`${nameC}`)
            await driver.findElement(By.id('lastName')).sendKeys(`${lastName}`)
            await driver.findElement(By.id('address')).sendKeys(`${address}`)
            await driver.findElement(By.id('phone')).sendKeys(`${phone}`)
            await driver.findElement(By.id('nameOfService')).sendKeys(`${nameOfService}`)
            await driver.findElement(By.id('placeOfAssembly')).sendKeys(`${placeOfAssembly}`)

            // driver.sleep(2000)
            await driver.findElement(By.id('dateOfService')).sendKeys(`${dateOfService}`)
            await driver.findElement(By.id('dateOfService')).sendKeys(webdriver.Key.TAB)
            await driver.findElement(By.id('dateOfService')).sendKeys(`${dateOfServiceH}`)
        
            await driver.findElement(By.id('DateNextInspection')).sendKeys(`${DateNextInspection}`)

            await driver.findElement(By.className('addClient-button')).click()


            let nameLastnameAdress = await driver.wait(webdriver.until.elementLocated(By.className('data-client-outside'))).getText().then(function(values){
                return values
            })

            let taskcheck = await driver.wait(webdriver.until.elementLocated(By.className('summary-data'))).getText().then(function(values){
                return values
            })

            let currentURL = await driver.getCurrentUrl().then(function(values){

                var UrlToString = values.toString()
                var splitUrl = UrlToString.split('/')
                var clientID = splitUrl[5]
                return clientID
            })
            addClientsID[loopIteration] = currentURL

            let taskID = await driver.executeScript(function() {
                return document.querySelector('.id').textContent
              }).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
              });

              firstAddedTasksID[loopIteration] = taskID

             if(loopIteration == 0){
                 tasksIDAddedToFirstClient[loopIteration] = taskID
             }

            nameLastnameAdress.should.equal(`Dane Klienta:\nImię: ${nameC}\nNazwisko: ${lastName}\nTel: ${phone}\nE-mail:\nAdres: ${address}`)

            var dateOfServiceDifferent = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            taskcheck.should.equal(`1. Usługa (1)\n${dateOfServiceDifferent} | ${dateOfServiceH} Usługa: ${nameOfService} Adres: ${placeOfAssembly}`)

            loopIteration++
            // driver.sleep(5000)
            await driver.quit()
        })
    })

    // ---------------------------------------------------------------------------------------------------------------------

    var addTaskIteration = 1
    var count = 2
    tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection}) => {
        
        it(`Add the task: (${nameOfService}) to the first client in the clients tab`, async function(){
            addTaskIteration++
            
            var driver = new webdriver.Builder()
                .forBrowser('chrome')
                .build();

            await driver.get(`http://localhost:3000/strona_glowna/klienci/${addClientsID[0]}`);

            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[3]/div[2]/button[1]'))).click()

            await driver.wait(webdriver.until.elementLocated(By.id('nameOfService'))).sendKeys(`${nameOfService}`)
            await driver.wait(webdriver.until.elementLocated(By.id('placeOfAssembly'))).sendKeys(`${placeOfAssembly}`)

            // driver.sleep(2000)
            await driver.wait(webdriver.until.elementLocated(By.id('dateOfService'))).sendKeys(`${dateOfService}`)
            await driver.wait(webdriver.until.elementLocated(By.id('dateOfService'))).sendKeys(webdriver.Key.TAB)
            await driver.wait(webdriver.until.elementLocated(By.id('dateOfService'))).sendKeys(`${dateOfServiceH}`)

            await driver.wait(webdriver.until.elementLocated(By.id('DateNextInspection'))).sendKeys(`${DateNextInspection}`)
            await driver.wait(webdriver.until.elementLocated(By.name('invoice'))).sendKeys(`${absolutePathPdf1}`)
            await driver.wait(webdriver.until.elementLocated(By.name('invoice'))).sendKeys(`${absolutePathPdf2}`)
            await driver.wait(webdriver.until.elementLocated(By.name('postWarrantyProtocols'))).sendKeys(`${absolutePathPdf3}`)

            await driver.wait(webdriver.until.elementLocated(By.className('addTask-button'))).click()
    
            //czeka aż nastąpi przekierowanie i pojawi się dodany klient
            let taskExist = await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[3]/div[4]/div['+count+']/details/summary/div[2]'))).getText().then(function(values){
                return values
            })

            //id zadań wyświetlanych na stronie internetowej
            var addedTaskID = []
            //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
            var summaryDataTaskID = []

            //pobiera id i dane dodanego uzytkownika ze strony
            for(var i=0; i<addTaskIteration; i++){

                var str1 = `return document.querySelectorAll('.id')[${i}].textContent;`
                addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                    var textContentSplit = textContent.split(' ')
                    return textContentSplit[1]
                });

                var str2 = `return document.querySelectorAll('.summary-data')[${i}].outerText;`
                summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                    var textContentSplit = textContent.split('\n')
                    return textContentSplit[1]
                });    
            }

            //zapisuje id dodanego uzytkownika w tabeli w programie
            var newTaskID = ''
            var numberAddedTask = 0
            for(var i=0; i<addedTaskID.length; i++){

                var inequalityCounter = 0
                for(var j=0; j<tasksIDAddedToFirstClient.length; j++){
                    if(addedTaskID[i] != tasksIDAddedToFirstClient[j]){
                        inequalityCounter++
                    }
                    if(addedTaskID[i] == tasksIDAddedToFirstClient[j]){
                        break
                    }
                }

                if(inequalityCounter == tasksIDAddedToFirstClient.length){
                    newTaskID = addedTaskID[i]
                    numberAddedTask = i
                }
            }
            tasksIDAddedToFirstClient[addTaskIteration-1] = newTaskID

            var dateOfServiceDifferent = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            summaryDataTaskID[numberAddedTask].should.equal(`${dateOfServiceDifferent} | ${dateOfServiceH} Usługa: ${nameOfService} Adres: ${placeOfAssembly}`)

            count++
            // driver.sleep(5000)
            await driver.quit()
        })
    });
})

//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

//describe block
describe("Testing whether the given sentences appear in the appropriate tabs of the application", function(){

    it('Checking if the tasks added by the user to be done for today are displayed on the home page.', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna');
        

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForTodayPlaceInTable = 0
        var allTaskForTodayPlaceInTable = []

        var countTaskForTodayAddedByUser = 0
        var placeInTable = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`          
            if(new Date(`${dateOfServiceDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)){

                allTaskForTodayPlaceInTable[iterationAllTaskForTodayPlaceInTable] = `client: ${placeInTable}`
                iterationAllTaskForTodayPlaceInTable++
                countTaskForTodayAddedByUser++
            }
            placeInTable++
        })

        placeInTable = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            if(new Date(`${dateOfServiceDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)){

                allTaskForTodayPlaceInTable[iterationAllTaskForTodayPlaceInTable] = `task: ${placeInTable}`
                iterationAllTaskForTodayPlaceInTable++
                countTaskForTodayAddedByUser++
            }
            placeInTable++
        })

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayedToday = await driver.executeScript("return document.querySelectorAll('.taskData').length;")
        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedToday; i++){
                
            var str1 = `var homeData = document.querySelectorAll('.taskData')[${i}]; return homeData.querySelector('label').textContent;`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `return document.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                return textContentSplit[1]
            });    
        }

        var countTaskForTodayHomePage = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForTodayPlaceInTable.length; i++){

            var clientOrTaskTable = allTaskForTodayPlaceInTable[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){
                        var dateOfServiceDifferent = `${clients[numberClientInTable].dateOfService[6]}${clients[numberClientInTable].dateOfService[7]}${clients[numberClientInTable].dateOfService[8]}${clients[numberClientInTable].dateOfService[9]}-${clients[numberClientInTable].dateOfService[3]}${clients[numberClientInTable].dateOfService[4]}-${clients[numberClientInTable].dateOfService[0]}${clients[numberClientInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${clients[numberClientInTable].dateOfServiceH} Klient: ${clients[numberClientInTable].nameC} ${clients[numberClientInTable].lastName} Usługa: ${clients[numberClientInTable].nameOfService} Adres: ${clients[numberClientInTable].placeOfAssembly} Tel.: ${clients[numberClientInTable].phone}`)
                        countTaskForTodayHomePage++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        var dateOfServiceDifferent = `${tasksForFirstClient[numberTaskInTable].dateOfService[6]}${tasksForFirstClient[numberTaskInTable].dateOfService[7]}${tasksForFirstClient[numberTaskInTable].dateOfService[8]}${tasksForFirstClient[numberTaskInTable].dateOfService[9]}-${tasksForFirstClient[numberTaskInTable].dateOfService[3]}${tasksForFirstClient[numberTaskInTable].dateOfService[4]}-${tasksForFirstClient[numberTaskInTable].dateOfService[0]}${tasksForFirstClient[numberTaskInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${tasksForFirstClient[numberTaskInTable].dateOfServiceH} Klient: ${clients[0].nameC} ${clients[0].lastName} Usługa: ${tasksForFirstClient[numberTaskInTable].nameOfService} Adres: ${tasksForFirstClient[numberTaskInTable].placeOfAssembly} Tel.: ${clients[0].phone}`)
                        countTaskForTodayHomePage++
                    }
                }
            }
        }

        //sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie taksów dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        countTaskForTodayAddedByUser.should.equal(countTaskForTodayHomePage)

        await driver.quit()
    })

    //---------------------------------------------------------------------------------------------------------------------
        
    it('Checking if the tasks added by the user to be performed up to 2 weeks ahead are displayed in the "Serwis" tab in the "Usługi zaplanowane 2 tygodnie do przodu:" section.', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis');

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForAheadPlaceInTable = 0
        var allTaskForAheadPlaceInTable = []

        var countTaskForAheadAddedByUser = 0
        var placeInTableAhead = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`          
            if((new Date(`${dateOfServiceDiffrentEqual}`) <= new Date(`${twoWeekahead.getFullYear()}-${twoAMonth}-${twoADay}`)) && (new Date(`${dateOfServiceDiffrentEqual}`) >= (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)))){
                if(new Date(`${dateOfServiceDiffrentEqual}`) == (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)) && new Date(`${dateOfServiceDiffrentEqual} ${dateOfServiceH}`) > new Date(`${today.getFullYear()}-${tMonth}-${tDay} ${tHour}:${tMinutes}`)){

                    allTaskForAheadPlaceInTable[iterationAllTaskForAheadPlaceInTable] = `client: ${placeInTableAhead}`
                    iterationAllTaskForAheadPlaceInTable++
                    countTaskForAheadAddedByUser++
                }

                if(new Date(`${dateOfServiceDiffrentEqual}`) > (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){

                    allTaskForAheadPlaceInTable[iterationAllTaskForAheadPlaceInTable] = `client: ${placeInTableAhead}`
                    iterationAllTaskForAheadPlaceInTable++
                    countTaskForAheadAddedByUser++
                }
            }
            placeInTableAhead++
        })

        placeInTableAhead = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            if((new Date(`${dateOfServiceDiffrentEqual}`) <= new Date(`${twoWeekahead.getFullYear()}-${twoAMonth}-${twoADay}`)) && (new Date(`${dateOfServiceDiffrentEqual}`) >= (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)))){
                if(new Date(`${dateOfServiceDiffrentEqual}`) == (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)) && new Date(`${dateOfServiceDiffrentEqual} ${dateOfServiceH}`) > new Date(`${today.getFullYear()}-${tMonth}-${tDay} ${tHour}:${tMinutes}`)){

                    allTaskForAheadPlaceInTable[iterationAllTaskForAheadPlaceInTable] = `task: ${placeInTableAhead}`
                    iterationAllTaskForAheadPlaceInTable++
                    countTaskForAheadAddedByUser++
                }

                if(new Date(`${dateOfServiceDiffrentEqual}`) > (new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){

                    allTaskForAheadPlaceInTable[iterationAllTaskForAheadPlaceInTable] = `task: ${placeInTableAhead}`
                    iterationAllTaskForAheadPlaceInTable++
                    countTaskForAheadAddedByUser++
                }
            }

            placeInTableAhead++
        })

        var wait = driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayedAhead = await driver.executeScript("return document.querySelector('.twoWeeksAhead').querySelectorAll('.taskDataOne').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedAhead; i++){

            var str1 = `var aheadTaskID = document.querySelector('.twoWeeksAhead'); return aheadTaskID.querySelectorAll('.taskDataOne')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `var aheadDataSummary = document.querySelector('.twoWeeksAhead'); return aheadDataSummary.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                return textContentSplit[1]
            });    
        }

        var countTaskForAheadSerwis = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForAheadPlaceInTable.length; i++){

            var clientOrTaskTable = allTaskForAheadPlaceInTable[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){

                        var dateOfServiceDifferent = `${clients[numberClientInTable].dateOfService[6]}${clients[numberClientInTable].dateOfService[7]}${clients[numberClientInTable].dateOfService[8]}${clients[numberClientInTable].dateOfService[9]}-${clients[numberClientInTable].dateOfService[3]}${clients[numberClientInTable].dateOfService[4]}-${clients[numberClientInTable].dateOfService[0]}${clients[numberClientInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${clients[numberClientInTable].dateOfServiceH} Klient: ${clients[numberClientInTable].nameC} ${clients[numberClientInTable].lastName} Usługa: ${clients[numberClientInTable].nameOfService} Adres: ${clients[numberClientInTable].placeOfAssembly}`)
                        countTaskForAheadSerwis++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        var dateOfServiceDifferent = `${tasksForFirstClient[numberTaskInTable].dateOfService[6]}${tasksForFirstClient[numberTaskInTable].dateOfService[7]}${tasksForFirstClient[numberTaskInTable].dateOfService[8]}${tasksForFirstClient[numberTaskInTable].dateOfService[9]}-${tasksForFirstClient[numberTaskInTable].dateOfService[3]}${tasksForFirstClient[numberTaskInTable].dateOfService[4]}-${tasksForFirstClient[numberTaskInTable].dateOfService[0]}${tasksForFirstClient[numberTaskInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${tasksForFirstClient[numberTaskInTable].dateOfServiceH} Klient: ${clients[0].nameC} ${clients[0].lastName} Usługa: ${tasksForFirstClient[numberTaskInTable].nameOfService} Adres: ${tasksForFirstClient[numberTaskInTable].placeOfAssembly}`)
                        countTaskForAheadSerwis++
                    }
                }
            }
        }

        //sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie taksów dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        countTaskForAheadAddedByUser.should.equal(countTaskForAheadSerwis)
        await driver.quit()
    })

    //---------------------------------------------------------------------------------------------------------------------

    it('Checking if the tasks added by the user to be performed up to 2 weeks behind are displayed in the "Serwis" tab in the "Usługi wykonane 2 tygodnie do tyłu:" section.', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis');

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForBehindPlaceInTable = 0
        var allTaskForBehindPlaceInTable = []

        var countTaskForBehindAddedByUser = 0
        var placeInTableBehind = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            if((new Date(`${dateOfServiceDiffrentEqual}`) >= new Date(`${twoWeekbehind.getFullYear()}-${twoBMonth}-${twoBDay}`)) && (dateOfServiceDiffrentEqual <= new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){
                if(new Date(`${dateOfServiceDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`) && new Date(`${dateOfServiceDiffrentEqual} ${dateOfServiceH}`) < new Date(`${today.getFullYear()}-${tMonth}-${tDay} ${tHour}:${tMinutes}`)){

                    allTaskForBehindPlaceInTable[iterationAllTaskForBehindPlaceInTable] = `client: ${placeInTableBehind}`
                    iterationAllTaskForBehindPlaceInTable++
                    countTaskForBehindAddedByUser++
                }

                if(new Date(`${dateOfServiceDiffrentEqual}`) < new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)){

                    allTaskForBehindPlaceInTable[iterationAllTaskForBehindPlaceInTable] = `client: ${placeInTableBehind}`
                    iterationAllTaskForBehindPlaceInTable++
                    countTaskForBehindAddedByUser++
                }
            }
            placeInTableBehind++
        })

        placeInTableBehind = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var dateOfServiceDiffrentEqual = `${dateOfService[6]}${dateOfService[7]}${dateOfService[8]}${dateOfService[9]}-${dateOfService[3]}${dateOfService[4]}-${dateOfService[0]}${dateOfService[1]}`
            if((new Date(`${dateOfServiceDiffrentEqual}`) >= new Date(`${twoWeekbehind.getFullYear()}-${twoBMonth}-${twoBDay}`)) && (dateOfServiceDiffrentEqual <= new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){
                if(new Date(`${dateOfServiceDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`) && new Date(`${dateOfServiceDiffrentEqual} ${dateOfServiceH}`) < new Date(`${today.getFullYear()}-${tMonth}-${tDay} ${tHour}:${tMinutes}`)){

                    allTaskForBehindPlaceInTable[iterationAllTaskForBehindPlaceInTable] = `task: ${placeInTableBehind}`
                    iterationAllTaskForBehindPlaceInTable++
                    countTaskForBehindAddedByUser++
                }

                if(new Date(`${dateOfServiceDiffrentEqual}`) < new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)){

                    allTaskForBehindPlaceInTable[iterationAllTaskForBehindPlaceInTable] = `task: ${placeInTableBehind}`
                    iterationAllTaskForBehindPlaceInTable++
                    countTaskForBehindAddedByUser++
                }
            }

            placeInTableBehind++
        })

        var wait = driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayedBehind = await driver.executeScript("return document.querySelector('.twoWeeksBack').querySelectorAll('.taskDataOne').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedBehind; i++){

            var str1 = `var behindTaskID = document.querySelector('.twoWeeksBack'); return behindTaskID.querySelectorAll('.taskDataOne')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `var behindDataSummary = document.querySelector('.twoWeeksBack'); return behindDataSummary.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                return textContentSplit[1]
            });    
        }

        var countTaskForBehindSerwis = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForBehindPlaceInTable.length; i++){

            var clientOrTaskTable = allTaskForBehindPlaceInTable[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){

                        var dateOfServiceDifferent = `${clients[numberClientInTable].dateOfService[6]}${clients[numberClientInTable].dateOfService[7]}${clients[numberClientInTable].dateOfService[8]}${clients[numberClientInTable].dateOfService[9]}-${clients[numberClientInTable].dateOfService[3]}${clients[numberClientInTable].dateOfService[4]}-${clients[numberClientInTable].dateOfService[0]}${clients[numberClientInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${clients[numberClientInTable].dateOfServiceH} Klient: ${clients[numberClientInTable].nameC} ${clients[numberClientInTable].lastName} Usługa: ${clients[numberClientInTable].nameOfService} Adres: ${clients[numberClientInTable].placeOfAssembly}`)
                        countTaskForBehindSerwis++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        var dateOfServiceDifferent = `${tasksForFirstClient[numberTaskInTable].dateOfService[6]}${tasksForFirstClient[numberTaskInTable].dateOfService[7]}${tasksForFirstClient[numberTaskInTable].dateOfService[8]}${tasksForFirstClient[numberTaskInTable].dateOfService[9]}-${tasksForFirstClient[numberTaskInTable].dateOfService[3]}${tasksForFirstClient[numberTaskInTable].dateOfService[4]}-${tasksForFirstClient[numberTaskInTable].dateOfService[0]}${tasksForFirstClient[numberTaskInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent}/${tasksForFirstClient[numberTaskInTable].dateOfServiceH} Klient: ${clients[0].nameC} ${clients[0].lastName} Usługa: ${tasksForFirstClient[numberTaskInTable].nameOfService} Adres: ${tasksForFirstClient[numberTaskInTable].placeOfAssembly}`)
                        countTaskForBehindSerwis++
                    }
                }
            }
        }

        //sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie taksów dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        countTaskForBehindAddedByUser.should.equal(countTaskForBehindSerwis)

        // driver.sleep(5000)
        await driver.quit()
    })

    //---------------------------------------------------------------------------------------------------------------------
        
    it('Checking if the tasks added by the user to be performed up to 2 weeks ahead inspection are displayed in the "Serwis" tab in the "Powiadomienia o następnym przeglądzie/wykonaniu telefonu 2 tygodnie do przodu:" section.', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis');

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForAheadNotificationPlaceInTable = 0
        var allTaskForAheadNotificationPlaceInTable = []

        var countTaskForAheadNotificationAddedByUser = 0
        var placeInTableAheadNotification = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var DateNextInspectionDiffrentEqual = `${DateNextInspection[6]}${DateNextInspection[7]}${DateNextInspection[8]}${DateNextInspection[9]}-${DateNextInspection[3]}${DateNextInspection[4]}-${DateNextInspection[0]}${DateNextInspection[1]}`
            if((new Date(`${DateNextInspectionDiffrentEqual}`) <= new Date(`${twoWeekahead.getFullYear()}-${twoAMonth}-${twoADay}`)) && (new Date(`${DateNextInspectionDiffrentEqual}` >= new Date(`${today.getFullYear()}-${tMonth}-${tDay}`)))){

                allTaskForAheadNotificationPlaceInTable[iterationAllTaskForAheadNotificationPlaceInTable] = `client: ${placeInTableAheadNotification}`
                iterationAllTaskForAheadNotificationPlaceInTable++
                countTaskForAheadNotificationAddedByUser++
            }
            placeInTableAheadNotification++
        })

        placeInTableAheadNotification = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var DateNextInspectionDiffrentEqual = `${DateNextInspection[6]}${DateNextInspection[7]}${DateNextInspection[8]}${DateNextInspection[9]}-${DateNextInspection[3]}${DateNextInspection[4]}-${DateNextInspection[0]}${DateNextInspection[1]}`
            if((DateNextInspectionDiffrentEqual <= `${twoWeekahead.getFullYear()}-${twoAMonth}-${twoADay}`) && (DateNextInspectionDiffrentEqual >= (`${today.getFullYear()}-${tMonth}-${tDay}`))){
                
                allTaskForAheadNotificationPlaceInTable[iterationAllTaskForAheadNotificationPlaceInTable] = `task: ${placeInTableAheadNotification}`
                iterationAllTaskForAheadNotificationPlaceInTable++
                countTaskForAheadNotificationAddedByUser++
            }

            placeInTableAheadNotification++
        })

        var wait = driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayedAheadNotification = await driver.executeScript("return document.querySelector('.twoWeeksInsp').querySelectorAll('.taskDataOne').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedAheadNotification; i++){

            var str1 = `var aheadNotificationTaskID = document.querySelector('.twoWeeksInsp'); return aheadNotificationTaskID.querySelectorAll('.taskDataOne')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `var aheadNotificationDataSummary = document.querySelector('.twoWeeksInsp'); return aheadNotificationDataSummary.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                var textContentSplitHour = textContentSplit[1].split('|')
                return textContentSplitHour[0].trim()
            });    
        }

        var countTaskForAheadNotificationSerwis = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForAheadNotificationPlaceInTable.length; i++){

            var clientOrTaskTable = allTaskForAheadNotificationPlaceInTable[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){

                        var DateNextInspectionDifferent = `${clients[numberClientInTable].DateNextInspection[6]}${clients[numberClientInTable].DateNextInspection[7]}${clients[numberClientInTable].DateNextInspection[8]}${clients[numberClientInTable].DateNextInspection[9]}-${clients[numberClientInTable].DateNextInspection[3]}${clients[numberClientInTable].DateNextInspection[4]}-${clients[numberClientInTable].DateNextInspection[0]}${clients[numberClientInTable].DateNextInspection[1]}`
                        summaryDataTaskID[j].should.equal(`${DateNextInspectionDifferent} Klient: ${clients[numberClientInTable].nameC} ${clients[numberClientInTable].lastName} Usługa: ${clients[numberClientInTable].nameOfService} Telefon: ${clients[numberClientInTable].phone}`)
                        countTaskForAheadNotificationSerwis++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        var DateNextInspectionDifferent = `${tasksForFirstClient[numberTaskInTable].DateNextInspection[6]}${tasksForFirstClient[numberTaskInTable].DateNextInspection[7]}${tasksForFirstClient[numberTaskInTable].DateNextInspection[8]}${tasksForFirstClient[numberTaskInTable].DateNextInspection[9]}-${tasksForFirstClient[numberTaskInTable].DateNextInspection[3]}${tasksForFirstClient[numberTaskInTable].DateNextInspection[4]}-${tasksForFirstClient[numberTaskInTable].DateNextInspection[0]}${tasksForFirstClient[numberTaskInTable].DateNextInspection[1]}`
                        summaryDataTaskID[j].should.equal(`${DateNextInspectionDifferent} Klient: ${clients[0].nameC} ${clients[0].lastName} Usługa: ${tasksForFirstClient[numberTaskInTable].nameOfService} Telefon: ${clients[0].phone}`)
                        countTaskForAheadNotificationSerwis++
                    }
                }
            }
        }

        // sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie taksów dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        countTaskForAheadNotificationAddedByUser.should.equal(countTaskForAheadNotificationSerwis)

        await driver.quit()
    })
    
    //---------------------------------------------------------------------------------------------------------------------
        
    it('Checking whether all tasks added by the user are displayed in the "Serwis/Wypisz wszystkie usługi" tab.', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis/wszystkie_uslugi');

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForAllTasks = 0
        var allTaskForAllTasksTable = []

        var countTasks = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            allTaskForAllTasksTable[iterationAllTaskForAllTasks] = `client: ${countTasks}`
            iterationAllTaskForAllTasks++
            countTasks++
        })

        countTasks = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            allTaskForAllTasksTable[iterationAllTaskForAllTasks] = `task: ${countTasks}`
            iterationAllTaskForAllTasks++
            countTasks++
        })

        var wait = driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayedInAllTasks = await driver.executeScript("return document.querySelector('.tasks-details-all').querySelectorAll('.task').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedInAllTasks; i++){

            var str1 = `var allTasksTaskID = document.querySelector('.tasks-details-all'); return allTasksTaskID.querySelectorAll('.task-data1')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `var allTasksDataSummary = document.querySelector('.tasks-details-all'); return allTasksDataSummary.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str2).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                return textContentSplit[1]
            });    
        }


        var countTaskForAllTasks = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForAllTasksTable.length; i++){

            var clientOrTaskTable = allTaskForAllTasksTable[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){

                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){

                        var dateOfServiceDifferent = `${clients[numberClientInTable].dateOfService[6]}${clients[numberClientInTable].dateOfService[7]}${clients[numberClientInTable].dateOfService[8]}${clients[numberClientInTable].dateOfService[9]}-${clients[numberClientInTable].dateOfService[3]}${clients[numberClientInTable].dateOfService[4]}-${clients[numberClientInTable].dateOfService[0]}${clients[numberClientInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent} | ${clients[numberClientInTable].dateOfServiceH} Klient: ${clients[numberClientInTable].nameC} ${clients[numberClientInTable].lastName} Usługa: ${clients[numberClientInTable].nameOfService} Adres: ${clients[numberClientInTable].placeOfAssembly}`)
                        countTaskForAllTasks++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        var dateOfServiceDifferent = `${tasksForFirstClient[numberTaskInTable].dateOfService[6]}${tasksForFirstClient[numberTaskInTable].dateOfService[7]}${tasksForFirstClient[numberTaskInTable].dateOfService[8]}${tasksForFirstClient[numberTaskInTable].dateOfService[9]}-${tasksForFirstClient[numberTaskInTable].dateOfService[3]}${tasksForFirstClient[numberTaskInTable].dateOfService[4]}-${tasksForFirstClient[numberTaskInTable].dateOfService[0]}${tasksForFirstClient[numberTaskInTable].dateOfService[1]}`
                        summaryDataTaskID[j].should.equal(`${dateOfServiceDifferent} | ${tasksForFirstClient[numberTaskInTable].dateOfServiceH} Klient: ${clients[0].nameC} ${clients[0].lastName} Usługa: ${tasksForFirstClient[numberTaskInTable].nameOfService} Adres: ${tasksForFirstClient[numberTaskInTable].placeOfAssembly}`)
                        countTaskForAllTasks++
                    }
                }
            }
        }

        //sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie taksów dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        iterationAllTaskForAllTasks.should.equal(countTaskForAllTasks)
        await driver.quit()
    })
})

//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

describe("Testing the functionality of the application", function(){

     it(`In task tab notification 2 weeks ahead, if the task is due today and "Zadzwoniłeś" is set to "Nie" then the task is red`, async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis');

        //zapisujemy do tablicy allTaskForTodayPlaceInTable taski, które chciał dodać użytkownik z datą wykonania zadania ustawioną na dziś
        var iterationAllTaskForAheadNotificationPlaceInTableFn = 0
        var allTaskForAheadNotificationPlaceInTableFn = []

        var countTaskForAheadNotificationAddedByUserFn = 0
        var placeInTableAheadNotificationFn = 0
        clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var DateNextInspectionDiffrentEqual = `${DateNextInspection[6]}${DateNextInspection[7]}${DateNextInspection[8]}${DateNextInspection[9]}-${DateNextInspection[3]}${DateNextInspection[4]}-${DateNextInspection[0]}${DateNextInspection[1]}`
            if((new Date(`${DateNextInspectionDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){

                allTaskForAheadNotificationPlaceInTableFn[iterationAllTaskForAheadNotificationPlaceInTableFn] = `client: ${placeInTableAheadNotificationFn}`
                iterationAllTaskForAheadNotificationPlaceInTableFn++
                countTaskForAheadNotificationAddedByUserFn++
            }
            placeInTableAheadNotificationFn++
        })

        placeInTableAheadNotificationFn = 0
        tasksForFirstClient.forEach(({nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{

            var DateNextInspectionDiffrentEqual = `${DateNextInspection[6]}${DateNextInspection[7]}${DateNextInspection[8]}${DateNextInspection[9]}-${DateNextInspection[3]}${DateNextInspection[4]}-${DateNextInspection[0]}${DateNextInspection[1]}`
            if((new Date(`${DateNextInspectionDiffrentEqual}`) == new Date(`${today.getFullYear()}-${tMonth}-${tDay}`))){
                
                allTaskForAheadNotificationPlaceInTableFn[iterationAllTaskForAheadNotificationPlaceInTableFn] = `task: ${placeInTableAheadNotificationFn}`
                iterationAllTaskForAheadNotificationPlaceInTableFn++
                countTaskForAheadNotificationAddedByUserFn++
            }

            placeInTableAheadNotificationFn++
        })

        var wait = driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []
        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskBackground = []

        var numberTasksDisplayedAheadNotificationFn = await driver.executeScript("return document.querySelector('.twoWeeksInsp').querySelectorAll('summary').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedAheadNotificationFn; i++){

            var str1 = `var aheadNotificationTaskIDFn = document.querySelector('.twoWeeksInsp'); return aheadNotificationTaskIDFn.querySelectorAll('.taskDataOne')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });

            var str2 = `var aheadNotificationSummaryBackground = document.querySelector('.twoWeeksInsp'); return aheadNotificationSummaryBackground.querySelectorAll('summary')[${i}].style.background;`
            summaryDataTaskBackground[i] = await driver.executeScript(str2).then(function(textContent) {

                return textContent
            });    
        }

        var countTaskForAheadNotificationSerwisFn = 0
        //porównujemy taski na dziś, które zostały dodane przez użytkownika z taskami wyświetlanymi na stronie głównej
        for(var i=0; i<allTaskForAheadNotificationPlaceInTableFn.length; i++){

            var clientOrTaskTable = allTaskForAheadNotificationPlaceInTableFn[i].split(' ')
            if(clientOrTaskTable[0] == 'client:'){

                var numberClientInTable = parseInt(clientOrTaskTable[1])
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == firstAddedTasksID[numberClientInTable]){

                        summaryDataTaskBackground[j].should.equal('red')
                        countTaskForAheadNotificationSerwisFn++
                    }
                }
            }

            if(clientOrTaskTable[0] == 'task:'){

                var numberTaskInTable = (parseInt(clientOrTaskTable[1]))
                for(var j=0; j<addedTaskID.length; j++){
                    if(addedTaskID[j] == tasksIDAddedToFirstClient[numberTaskInTable+1]){

                        summaryDataTaskBackground[j].should.equal('red')
                        countTaskForAheadNotificationSerwisFn++
                    }
                }
            }
        }

        // sprawdzenie czy liczba wyświetlanych taksów na stronie internetowej jest równa liczbie tasków dodanych przez użytkownika (czy na stronie wyświetlają się wszystkie taski na dzisiaj)
        countTaskForAheadNotificationAddedByUserFn.should.equal(countTaskForAheadNotificationSerwisFn)

        // driver.sleep(5000)
        await driver.quit()
    })

    //---------------------------------------------------------------------------------------------------------------------

    it('Checking the operation of the search engine in the "Wszystkie usługi" tab', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('http://localhost:3000/strona_glowna/serwis/wszystkie_uslugi');

        await driver.wait(webdriver.until.elementLocated(By.id('search_input'))).sendKeys(`${clients[0].nameC} ${clients[0].lastName}`)

        var wait = await driver.wait(webdriver.until.elementLocated(By.className("summary-data")))

        //dane zadań wyświetlanych na stronie internetowej, pierwsze id z tablicy addedTaskID odpowiada pierwszemu elementowi z tablicy summaryDataTaskID z danymi zadania, czyli pod indekasmi 0 sa powiązne ze sobą id zadania i dane zadania dodanych do pierwszego klienta
        var summaryDataTaskID = []

        var numberTasksDisplayed = await driver.executeScript("return document.querySelector('.tasks-details-all').querySelectorAll('.task').length")
        var countBlock = 0
        for(var i=0; i<numberTasksDisplayed; i++){

            var strBlock = `return document.querySelector('.tasks-details-all').querySelectorAll('.task')[${i}].style.display;`
            var blockElement = await driver.executeScript(strBlock)
            if(blockElement == 'block'){
                countBlock++
            }
        }

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayed; i++){

            var str1 = `var behindDataSummary = document.querySelector('.tasks-details-all'); return behindDataSummary.querySelectorAll('.summary-data')[${i}].outerText;`
            summaryDataTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split('\n')
                return textContentSplit[1]
            });    
        }

        var countInclude = 0
        for(var i=0; i<numberTasksDisplayed; i++){
            if(summaryDataTaskID[i].includes(`${clients[0].nameC} ${clients[0].lastName}`)){
                countInclude++
            }
        }

        countBlock.should.equal(countInclude)

        await driver.quit()
    })
})

//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

describe("Testing the client and task delete function", function(){
        
    it(`Check the action of deleting the last added task from the first client.`, async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
                
        var lastTaskID = (tasksIDAddedToFirstClient.length-1)
        var getLastTaskID = tasksIDAddedToFirstClient[lastTaskID]

        await driver.get(`http://localhost:3000/strona_glowna/klienci/${addClientsID[0]}/${getLastTaskID}/usun_usluge`);

        await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div/form/button'))).click()
        var wait = await driver.wait(webdriver.until.elementLocated(By.className("longTasks")))

        //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
        //id zadań wyświetlanych na stronie internetowej
        var addedTaskID = []

        var numberTasksDisplayedClient = await driver.executeScript("return document.querySelectorAll('.task').length")

        //pobiera id i dane dodanego uzytkownika ze strony
        for(var i=0; i<numberTasksDisplayedClient; i++){

            var str1 = `var taskIDInClient = document.querySelector('.tasks-details'); return taskIDInClient.querySelectorAll('.longTasks')[${i}].querySelector('label').textContent`
            addedTaskID[i] = await driver.executeScript(str1).then(function(textContent) {

                var textContentSplit = textContent.split(' ')
                return textContentSplit[1]
            });   
        }

        var deleteTaskExist = 0
        for(var i=0; i<addedTaskID.length; i++){
            if(addedTaskID[i] == getLastTaskID){
                deleteTaskExist++
            }
        }

        deleteTaskExist.should.equal(0)
            
        // await driver.sleep(5000)
        await driver.quit()
    })

    //--------------------------------------------------------------------------------------------------------------------

    var coutClientC = 0
    var numberClient = 0
    clients.forEach(({nameC, lastName, address, phone, nameOfService, placeOfAssembly, dateOfService, dateOfServiceH, DateNextInspection})=>{
        
        it(`Check deletion of all clients, deleted client number: ${numberClient+1}. ${nameC} ${lastName}`, async function(){

            var driver = new webdriver.Builder()
                .forBrowser('chrome')
                .build();
                
            await driver.get(`http://localhost:3000/strona_glowna/klienci/${addClientsID[coutClientC]}/usun_klienta`);
            
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div/button[1]'))).click()
            var wait = await driver.wait(webdriver.until.elementLocated(By.className("clients")))

            //zapisujemy wszystkie taski, które znajdują się na stronie głównej do tablicy, (id taska do tablicy addedTaskID), (dane taska do tablicy summaryDataTaskID)
            //id zadań wyświetlanych na stronie internetowej
            var summaryDataClient = []

            var numberClientDisplayed = await driver.executeScript("return document.querySelectorAll('.client').length")

            //pobiera id i dane dodanego uzytkownika ze strony
            for(var j=0; j<numberClientDisplayed; j++){

                var str1 = `var clientDataSummary = document.querySelector('.clients'); return clientDataSummary.querySelectorAll('.summary-data')[${j}].outerText;`
                summaryDataClient[j] = await driver.executeScript(str1).then(function(textContent) {

                    var textContentSplit = textContent.split('\n')
                    return textContentSplit[1]
                });  
            }

            var deleteClientExist = 0
            for(var j=0; j<summaryDataClient.length; j++){
                if(summaryDataClient[j] == `Imię: ${nameC} Nazwisko: ${lastName} Adres: ${address}`){
                    deleteClientExist++
                }
            }

            //sprawdzenie czy klient zostal usuniety
            deleteClientExist.should.equal(0)

            coutClientC++
            // await driver.sleep(5000)
            await driver.quit()
        })
        numberClient++
    })
})

//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

describe("Testing logout from application", function(){
  
    it('Check logout from application', async function(){

        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
                
        await driver.get('http://localhost:3000/strona_glowna');
            
        await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="container"]/nav/div/div/ul/div/li[2]/button'))).click()
        await driver.wait(webdriver.until.elementLocated(By.id('login')))
        
        var tekst = await driver.executeScript("return document.querySelector('h2').outerText;")

        tekst.should.equal('Logowanie')

        await driver.quit()
    })
})