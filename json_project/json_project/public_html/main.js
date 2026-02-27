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
    // the images are showing up for all except the 1st row 
    // but in the console.log the links for the images are showing up properly
    //console.log("image 1", example_image1)
    //console.log("image 2", example_image2)

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
        json.goal.targets.sort((a, b) => a[key] < b[key] ? -1 : 1)
    } else {
        json.goal.targets.sort((a, b) => a[key] < b[key] ? 1 : -1)
    }
    displayTable()
}

function showAddModal() {
    document.getElementById("header").style.display = "none"
    document.getElementById("table").style.display = "none"
    document.getElementById("addButton").style.display = "none"
    document.getElementById("addModal").showModal()
}

function hideAddModal() {
    document.getElementById("addModal").close()
    displayTable()
}

// adding code initially taken from derek.comp: https://derek.comp.dkit.ie/
function addData() {
    let number = document.getElementById("number").value
    let description = document.getElementById("description").value
    let title1 = document.getElementById("title1").value


    let emptyExample = {title: "", description: "", images: [""], tags: []}

    // examples has to be an array with 2 arrays in it, so putting emptyExample in examples twice makes this an array of 2 empty arrays
    let newData = {id: uniqueId, number: number, description: description, examples: [emptyExample, emptyExample]}

    json.goal.targets.push(newData)

    uniqueId++
    hideAddModal()
}
