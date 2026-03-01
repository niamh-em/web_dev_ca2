// declarations 
let keys
let uniqueId
let json = {}
let rand1
let rand2

function loadJSONData() {
    let url = `./json/un_goals.json`
    fetch(url)
            .then(response => response.json())
            .then(jsonData => {

                json = jsonData
                // getting the keys 
                keys = Object.keys(json.goal.targets[0]) // array of 4 
                // getting a unique id for adding data 
                uniqueId = json.goal.targets.length + 1
                displayTable()
            })
}

// initially set the sort to ascending order
let sortAscendingOrder = true

// initially set the last sorted column to be id
let lastSortColumnName = "id"

function displayTable() {
    // resetting to be visible again
    document.getElementById("header").style.display = "block"
    document.getElementById("table").style.display = "block"
    document.getElementById("addButton").style.display = "block"

    // dynamically making the header
    let headerString = `<h1>Goal ${json.goal.number}: ${json.goal.title} </h1> <br>
                        <h3>${json.goal.description}</h3>
                        <p>Official Link: <a href="${json.goal.links.official}" target="blank">${json.goal.links.official}</a></p>
                        <p>UNDP Link: <a href="${json.goal.links.undp}" target="blank">${json.goal.links.undp}</a></p>`

    document.getElementById("header").innerHTML = headerString

    // setting the favourite property
    json.goal.targets.forEach(target => {
        target.examples.forEach(example => {
            // for the favourite property
            // assigns either 0 or 1
            rand1 = Math.floor(Math.random()*2)
            if (Math.random() < 0.5) {
                example.favourite = "Yes"
            }
            else {
                example.favourite = "No"
            }
            
            // for the rating property
            rand2 = Math.floor(Math.random() * 6)
            if (rand2 === 0){
                example.rating = rand2
            }
            else if (rand2 === 1){
                example.rating = rand2
            }
            else if (rand2 === 2){
                example.rating = rand2
            }
            else if (rand2 === 3){
                example.rating = rand2
            }
            else if (rand2 === 4){
                example.rating = rand2
            }
            else if (rand2 === 5){
                example.rating = rand2
            }
            else {
                example.rating = rand2
            }
    })})
            // arrow changes whether ascending is true or not 
            let arrow = sortAscendingOrder === true ? " ↑" : " ↓"

            let htmlString = `<table>
                        <thead>
                            <tr>`

            // getting the table headers from the keys 
            keys.forEach(key => {
            // we don't want to show examples in the table because if we do they are undefined at this point (plus we show them later in the modal)
            if (key !== "examples") {
            htmlString += `<th onclick=sort("${key}")>${key}${lastSortColumnName === key ? arrow : ""}</th>`
            }
            })

            htmlString += `</tr>
                        </thead><tbody>`

            // getting the content for the body of the table 
            json.goal.targets.forEach(target =>
            {
            htmlString += `<tr>`,
                    keys.forEach(key => {
                    // we don't want to show examples in the table because if we do they are undefined at this point (plus we show them later in the modal)
                    if (key !== "examples") {
                    htmlString += `<td onclick="openModal(${target.id})">${target[key]}</td>`
                    }
                    }),
                    htmlString += `<td><input type="button" value="Modify"/></td><td><input type="button" value="Delete"/></td></tr>`
            }
            )

            htmlString += `</tbody></table>`

            document.getElementById("table").innerHTML = htmlString

            }
            

// initial code for modal taken from derek.comp: https://derek.comp.dkit.ie/
function openModal(givenId) {

    document.getElementById("modal").showModal()

    // used .find() because that filters through the array and returns the first value to pass the test
    // but it also returns it as an object and not as an array
    let exampleDisplay = json.goal.targets.find(target => target.id === givenId)
    let htmlString = `<p>ID: ${givenId} <br>
                    Number: ${exampleDisplay.number} <br>
                    Description: '${exampleDisplay.description}' <br>
                    Example: <br>`

    exampleDisplay.examples.forEach(example => {
        htmlString += `Title: ${example.title} <br>
                        Description: ${example.description} <br>`
        example.images.forEach(image => {
            htmlString += `<img src=${image}><br>`
        })
        htmlString += `Favourite: ${example.favourite}<br>
                        Rating: ${example.rating}<br>`
    })

    document.getElementById("modal-content").innerHTML = htmlString
}

function closeModal() {
    document.getElementById('modal').close()
}

// intial sort code taken from derek.comp: https://derek.comp.dkit.ie/
function sort(key)
{
    if (lastSortColumnName === key) {
        // if the last clicked coloumn is the same as the key, it sorts in the reverse
        sortAscendingOrder = !sortAscendingOrder
    } else {
        lastSortColumnName = key
        sortAscendingOrder = true
    }

    if (sortAscendingOrder) {
        json.goal.targets.toLowerCase().sort((a, b) => a[key] < b[key] ? -1 : 1)
    } else {
        json.goal.targets.toLowerCasesort((a, b) => a[key] < b[key] ? 1 : -1)
    }
    displayTable()
}

function showAddForm() {
    // hiding the buttons
    document.getElementById("addButton").style.display = "none"
    
    // creating the form
    htmlString = `<h4>Add Data</h4>
                <label>ID: ${uniqueId}</label><br>
                <label>Number: </label><input type="number" id="number" placeholder="Number"><br>
                <label>Description: </label><input type="text" id="description" placeholder="Description"><br>
                <br><label>Example 1:</label><br>
                <label>Title: </label><input type="text" id="example1Title" placeholder="Title"><br>
                <label>Description</label><input type="text" id="example1Description" placeholder="Description"><br>
                <label>Image </label><input type="text" id="example1Image" placeholder="image link" oninput="showImage1()"><br>
                <div id="showExample1Image"></div><br>
                <br><label>Example 2:</label><br>
                <label>Title: </label><input type="text" id="example2Title" placeholder="Title"><br>
                <label>Description</label><input type="text" id="example2Description" placeholder="Description"><br>
                <label>Image </label><input type="text" id="example2Image" placeholder="image link" oninput="showImage2()"><br>
                <div id="showExample2Image"></div><br>`
    
    htmlString += `<br>
                <input type="button" value="Cancel" onclick="displayTable()"/>
                <input type="button" value="Add Data to Table" onclick="addData()"/>`
    
    // replacing the table with the add form
    document.getElementById("table").innerHTML = htmlString
}

// oninput idea gotten from w3Schools: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_oninput 
function showImage1(){
    let image1 = document.getElementById("example1Image").value
    document.getElementById("showExample1Image").innerHTML = `<img src=${image1} alt="user's image 1">`
}

function showImage2(){
    let image2 = document.getElementById("example2Image").value
    document.getElementById("showExample2Image").innerHTML = `<img src=${image2} alt="user's image 2">`
}

// adding code initially taken from derek.comp: https://derek.comp.dkit.ie/
function addData() {
    let number = document.getElementById("number").value
    let description = document.getElementById("description").value
    
    // example 1 
    let title1 = document.getElementById("example1Title").value
    let description1 =  document.getElementById("example1Description").value
    let image1 =  document.getElementById("example1Image").value
    
    // example 2 
    let title2 = document.getElementById("example2Title").value
    let description2 =  document.getElementById("example2Description").value
    let image2 =  document.getElementById("example2Image").value
    
    // making examples to add to the newData which will be added to the json
    let example1Array = {title: title1, description: description1, images:[image1], tags: []}
    let example2Array = {title: title2, description: description2, images:[image2], tags: []}
    
    // making the array to add to json
    let newData = {id: uniqueId, number: number, description: description, examples: [example1Array, example2Array]}
    
    json.goal.targets.push(newData)
    
    uniqueId++
    displayTable()
}
