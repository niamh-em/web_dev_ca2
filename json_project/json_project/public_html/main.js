// declarations
let keys
let uniqueId
let json = {}
// initially set the sort to ascending order
let sortAscendingOrder = true
let tagsSortAscendingOrder = true
// initially set the last sorted column to be id
let lastSortColumnName = "id"
let rand1
let rand2
let titleText
let descriptionText
let inputText
let imgText
let modifyTitles = []
let modifyDescriptions = []
let modifyImages = []
let tags = []

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

function displayTable() {
    // resetting to be visible again
    document.getElementById("header").style.display = "block"
    document.getElementById("table").style.display = "block"
    document.getElementById("menu").style.display = "block"

    // making an array of all the tags
    json.goal.targets.forEach(target => {
        target.examples.forEach(example => {
            // using forEach and not map because if we used map it would rewrite the array everytime
            example.tags.forEach(tag => tags.push(tag))
        })
    })

    // making an array of unique tags only
    uniqueTags = [...new Set(tags)]

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
            rand1 = Math.floor(Math.random() * 2)
            if (Math.random() < 0.5) {
                example.favourite = "Yes"
            } 
            else {
                example.favourite = "No"
            }

            // for the rating property
            rand2 = Math.floor(Math.random() * 6)
            example.rating = rand2
        })
    })
    // arrow changes whether ascending is true or not
    let arrow = sortAscendingOrder === true ? " ↑" : " ↓"

    let htmlString = `<table>
                        <thead>
                            <tr id="headingRow">`

    // getting the table headers from the keys
    keys.forEach(key => {
        // we don't want to show examples in the table because if we do they are undefined at this point (plus we show them later in the modal)
        if (key !== "examples") {
            htmlString += `<th onclick=pickingSort("${key}")>${key}${lastSortColumnName === key ? arrow : ""}</th>`
        }
    })

    htmlString += `<th></th><th></th></tr>
                        </thead><tbody>`

    // getting the content for the body of the table
    json.goal.targets.forEach(target => {
        htmlString += `<tr>`,
                keys.forEach(key => {
                    // we don't want to show examples in the table because if we do they are undefined at this point (plus we show them later in the modal)
                    if (key !== "examples") {
                        htmlString += `<td onclick="openModal(${target.id})">${target[key]}</td>`
                    }
                }),
                htmlString += `<td><input type="button" value="Modify" onclick="showModifyForm(${target.id})"/></td><td><input type="button" value="Delete" onclick="deleteModal(${target.id})"/></td></tr>`
    }
    )

    htmlString += `</tbody></table>`

    document.getElementById("table").innerHTML = htmlString
}


// initial code for modal taken from derek.comp: https://derek.comp.dkit.ie/
function openModal(givenId) {
    // opening the modal
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
        htmlString += `Tags: ${example.tags} <br>
                        Favourite: ${example.favourite}<br>
                        Rating: ${example.rating}<br>`
    })

    htmlString += `<input type="button" value="Close" onclick="closeModal()"/>`

    document.getElementById("modal-content").innerHTML = htmlString
}

function closeModal() {
    document.getElementById('modal').close()
}

function pickingSort(key) {
    if (key.localeCompare("id") === 0) {
        numSort(key)
    } 
    else {
        stringSort(key)
    }
}

// intial sort code taken from derek.comp: https://derek.comp.dkit.ie/
function numSort(key)
{
    if (lastSortColumnName === key) {
        // if the last clicked coloumn is the same as the key, it sorts in the reverse
        sortAscendingOrder = !sortAscendingOrder
    } 
    else {
        lastSortColumnName = key
        sortAscendingOrder = true
    }

    if (sortAscendingOrder) {
        json.goal.targets.sort((a, b) => a[key] < b[key] ? -1 : 1)
    } 
    else {
        json.goal.targets.sort((a, b) => a[key] < b[key] ? 1 : -1)
    }
    displayTable()
}

function stringSort(key) {
    if (lastSortColumnName === key) {
        // if the last clicked coloumn is the same as the key, it sorts in the reverse
        sortAscendingOrder = !sortAscendingOrder
    } 
    else {
        lastSortColumnName = key
        sortAscendingOrder = true
    }

    if (sortAscendingOrder) {
        json.goal.targets.sort((a, b) => {
            let x = a[key].toLowerCase()
            let y = b[key].toLowerCase()
            return x.localeCompare(y)
        })
    } 
    else {
        json.goal.targets.sort((a, b) => {
            let x = a[key].toLowerCase()
            let y = b[key].toLowerCase()
            return y.localeCompare(x)
        })
    }
    displayTable()
}

function showAddForm() {
    // hiding the header and buttons
    document.getElementById("header").style.display = "none"
    document.getElementById("menu").style.display = "none"

    // creating the form
    htmlString = `<h4>Add Data</h4>
                <form novalidate>
                <label>ID: ${uniqueId}</label><br>
                <label>Number: </label><input type="number" id="number" placeholder="Number">
                <label class = "errorMessages" id = "numberErrorMessage"></label><br>
                <label>Description: </label><input type="text" id="description" placeholder="Description">
                <label class = "errorMessages" id = "descriptionErrorMessage"></label><br>
                <br><b><label>Example 1:</label></b><br>
                <label>Title: </label><input type="text" id="example1Title" placeholder="Title">
                <label class = "errorMessages" id = "example1TitleErrorMessage"></label><br>
                <label>Description</label><input type="text" id="example1Description" placeholder="Description">
                <label class = "errorMessages" id="example1DescriptionErrorMessage"></label><br>
                <label>Image </label><input type="text" id="example1Image" placeholder="Image Link" oninput="showImage1()">
                <label class = "errorMessages" id="example1ImageErrorMessage"></label><br>
                <div id="showExample1Image"></div>
                <label>Tag: </label><input type="text" id="example1Tag" placeholder="Tag">
                <label class="errorMessages" id="example1TagErrorMessage"></label><br>
                <br><b><label>Example 2:</label></b><br>
                <label>Title: </label><input type="text" id="example2Title" placeholder="Title">
                <label class = "errorMessages" id = "example2TitleErrorMessage"></label><br>
                <label>Description</label><input type="text" id="example2Description" placeholder="Description">
                <label class = "errorMessages" id ="example2DescriptionErrorMessage"></label><br>
                <label>Image </label><input type="text" id="example2Image" placeholder="Image Link" oninput="showImage2()">
                <label class = "errorMessages" id="example2ImageErrorMessage"></label><br>
                <div id="showExample2Image" ></div>
                <label>Tag: </label><input type="text" id="example2Tag" placeholder="Tag">
                <label class="errorMessages" id="example2TagErrorMessage"></label><br>`

    htmlString += `<br>
                <input type="button" value="Cancel" onclick="displayTable()"/>
                <input type="button" value="Add Data to Table" onclick="isFormValid()"/>
                </form>`

    // replacing the table with the add form
    document.getElementById("table").innerHTML = htmlString
}

// adding code initially taken from derek.comp: https://derek.comp.dkit.ie/
function addData() {
    let number = document.getElementById("number").value
    let description = document.getElementById("description").value

    // example 1
    let title1 = document.getElementById("example1Title").value
    let description1 = document.getElementById("example1Description").value
    let image1 = document.getElementById("example1Image").value

    // example 2
    let title2 = document.getElementById("example2Title").value
    let description2 = document.getElementById("example2Description").value
    let image2 = document.getElementById("example2Image").value

    // making examples to add to the newData which will be added to the json
    let example1Array = {title: title1, description: description1, images: [image1], tags: []}
    let example2Array = {title: title2, description: description2, images: [image2], tags: []}

    // making the array to add to json
    let newData = {id: uniqueId, number: number, description: description, examples: [example1Array, example2Array]}

    json.goal.targets.push(newData)

    uniqueId++
    displayTable()
}

// oninput idea gotten from w3Schools: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_oninput
function showImage1() {
    let image1 = document.getElementById("example1Image").value
    document.getElementById("showExample1Image").innerHTML = `<img src=${image1} alt="user's image 1">`
}

function showImage2() {
    let image2 = document.getElementById("example2Image").value
    document.getElementById("showExample2Image").innerHTML = `<img src=${image2} alt="user's image 2">`
}

function showModifyImage(imgText, inputText) {
    let modifyImage = document.getElementById(inputText).value
    // the .src replaces the src of the image
    document.getElementById(imgText).src = modifyImage
}

function showModifyForm(givenId) {
    // hiding the header and buttons
    document.getElementById("header").style.display = "none"
    document.getElementById("menu").style.display = "none"

    let exampleDisplay = json.goal.targets.find(target => target.id === givenId)

    // creating the for Modify Form
    htmlString = `<h4>Modify Data</h4>
                <label>ID: ${givenId}</label><br>
                <label>Number: </label><input type="number" id="number" value="${exampleDisplay.number}"><br>
                <label>Description: </label><input type="text" id="description" value="${exampleDisplay.description}"><br>`

    for (let i = 0; i < exampleDisplay.examples.length; i++) {
        titleText = "example" + i + "Title"
        descriptionText = "example" + i + "Description"
        htmlString += `<br><br><label>Example ${i + 1}</label><br>
                       <label>Title: </label><input type="text" id="${titleText}" value="${exampleDisplay.examples[i].title}"><br>
                       <label>Description: </label><input type="text" id="${descriptionText}" value="${exampleDisplay.examples[i].description}">`
        for (let j = 0; j < exampleDisplay.examples[i].images.length; j++) {
            imgText = "example" + i + "Image" + j
            inputText = "example" + i + "Input" + j
            htmlString += `<br><label>Image ${j + 1}: </label>
                           <input type="text" id="${inputText}" value="${exampleDisplay.examples[i].images[j]}" oninput="showModifyImage('${imgText}', '${inputText}')">
                           <br><img id="${imgText}" src="${exampleDisplay.examples[i].images[j]}"/>`
        }
    }

    htmlString += `<br>
                <input type="button" value="Cancel" onclick="displayTable()"/>
                <input type="button" value="Modify Data" onclick="modifyData(${givenId})"/>`

    // replacing the table with the add form
    document.getElementById("table").innerHTML = htmlString
}

function modifyData(givenId) {
    // clearing the arrays each time data is modified
    modifyTitles = []
    modifyDescriptions = []
    modifyImages = []

    // getting the number and description values
    let number = document.getElementById("number").value
    let description = document.getElementById("description").value

    // establishing exampleDisplay
    let exampleDisplay = json.goal.targets.find(target => target.id === givenId)

    // counter to make sure no image in the array of images gets overwritten
    let counter = 0

    // getting data for each example in the chosen target
    for (let i = 0; i < exampleDisplay.examples.length; i++) {
        // creating data ids for the arrays
        titleText = "example" + i + "Title"
        descriptionText = "example" + i + "Description"

        // making the arrays and pushing data into them
        modifyTitles[i] = document.getElementById(titleText).value
        modifyDescriptions[i] = document.getElementById(descriptionText).value

        // adding all the images to one array
        for (let j = 0; j < exampleDisplay.examples[i].images.length; j++) {
            // creating ids for the images
            imgText = "example" + i + "Image" + j
            inputText = "example" + i + "Input" + j

            // adding the link to the image array
            modifyImages[counter] = document.getElementById(inputText).value
            counter++
        }
    }
    
    // i = the amount of examples
    // j = the amount of images
    // counter = index of images in image array
    // j != counter bc
    // once the j loop finishes and goes back for another i loop, j resets and would overwrite an image

    // actually modifiying the data
    json.goal.targets.forEach(target => {
        if (target.id === givenId) {

            // modifying number and description
            target.number = number
            target.description = description

            // go through the array modifyTitle and change the title at the example index to the modifyTitle at the same index
            // so title 1 (index 0) for example 1 (index 0)
            for (let i = 0; i < modifyTitles.length; i++) {
                target.examples[i].title = modifyTitles[i]
            }

            // go through the array modifyDescription and change the description at the example index to the modifyDescription at the same index
            // so description 1 (index 0) for example 1 (index 0)
            for (let i = 0; i < modifyDescriptions.length; i++) {
                target.examples[i].description = modifyDescriptions[i]
            }

            // setting counters for the example and image array indexes
            let exampleIndex = 0
            let imageIndex = 0

            // doesn't really matter which example we use
            if (target.examples[0].images.length !== 1) {

                // loop for length not being 1
                for (let i = 0; i < modifyImages.length; i++) {

                    // checking if i is halfway through the length
                    if ((modifyImages.length / 2) === i) {

                        // increasing the exampleIndex to move on to the next example array
                        // resetting the imageIndex back to 0 so when we start modifying the new example array we start from the beginnning of the image array
                        exampleIndex++
                        imageIndex = 0
                    }
                    target.examples[exampleIndex].images[imageIndex] = modifyImages[i]
                    imageIndex++
                }
            } 
            else {
                // loop if length is 1
                for (let i = 0; i < modifyImages.length; i++) {
                    target.examples[exampleIndex].images[imageIndex] = modifyImages[i]
                    exampleIndex++
                }
            }
        }
    })

    displayTable()
}

function deleteModal(id) {
    document.getElementById("deleteModal").showModal()
    let htmlString = `<h3>Delete</h3><br>
                        <p>Are you sure you want to delete ${id}?</p><br>
                        <input type="button" value="Cancel" onclick="closeDeleteModal()"/>
                        <input type="button" value="Yes, Delete" onclick="deleteData(${id})"/>`
    document.getElementById("delete-content").innerHTML = htmlString
}

function deleteData(id) {
    let selectedIndex
    json.goal.targets.forEach((target, index) =>
    {
        if (target.id === id){
            selectedIndex = index
        }
    })

    json.goal.targets.splice(selectedIndex, 1)
    document.getElementById('deleteModal').close()
    displayTable()
}

function closeDeleteModal() {
    document.getElementById('deleteModal').close()
}

function displayTagsManager() {
    // resetting to be visible again
    document.getElementById("header").style.display = "block"
    document.getElementById("table").style.display = "block"
    document.getElementById("menu").style.display = "block"

    // dynamically making the header
    let headerString = `<h1>Tags Manager </h1> <br>`
    document.getElementById("header").innerHTML = headerString

    // arrow changes whether ascending is true or not
    let arrow = tagsSortAscendingOrder === true ? " ↑" : " ↓"

    // making the list to show the tags
    htmlString = `<table><thead><tr><th onclick="tagsSort()">Tags ${arrow}</th><th></th><th></th></tr></thead><tbody>`
    uniqueTags.forEach(tag => {
        htmlString += `<tr><td>${tag}</td><td><input type="button" value="Modify" onclick="showModifyTagsForm('${tag}')"/></td><td><input type="button" value="Delete" onclick="deleteTagsModal('${tag}')"/></td></tr>`
    })

    htmlString += `</tbody></table>`

    document.getElementById("table").innerHTML = htmlString
}

function tagsSort() {
    tagsSortAscendingOrder = !tagsSortAscendingOrder

    if (tagsSortAscendingOrder) {
        uniqueTags.sort((a, b) => {
            // localeCompare() compares the 2 strings and returns -1, 0 or 1 depending on the order
            // so if a is b4 b, then = -1
            // if a = b, then = 0
            // and if b is b4 a, then = 1
            return a.toLowerCase().localeCompare(b.toLowerCase())
        })
    } 
    else {
        uniqueTags.sort((a, b) => {
            return b.toLowerCase().localeCompare(a.toLowerCase())
        })
    }
    displayTagsManager()
}

function showTagsAddForm() {
    // hiding the header and buttons
    document.getElementById("header").style.display = "none"
    document.getElementById("menu").style.display = "none"

    // creating the form
    htmlString = `<h4>Add Tag</h4><br>
                <label>Tag: </label><input type="text" id="newTag" placeholder="New Tag"><br>`

    htmlString += `<br>
                <input type="button" value="Cancel" onclick="displayTagsManager()"/>
                <input type="button" value="Add Data to Table" onclick="addTagsData()"/>`

    // replacing the table with the add form
    document.getElementById("table").innerHTML = htmlString
}

// adding code initially taken from derek.comp: https://derek.comp.dkit.ie/
function addTagsData() {
    let newTag = document.getElementById("newTag").value

    uniqueTags.push(newTag)

    displayTagsManager()
}

function showModifyTagsForm(chosenTag) {
    // hiding the header and buttons
    document.getElementById("header").style.display = "none"
    document.getElementById("menu").style.display = "none"

    // getting the index of the chosenTag
    // indexOf found on w3schools: https://www.w3schools.com/jsref/jsref_indexof_array.asp
    let index = uniqueTags.indexOf(chosenTag);

    // creating the for Modify Form
    htmlString = `<h4>Modify Tag</h4>
                <label>Tag: </label><input type="text" id="modifiedTag" value="${chosenTag}"><br>
                <br>
                <input type="button" value="Cancel" onclick="displayTagsManager()"/>
                <input type="button" value="Modify Data" onclick="modifyTagsData(${index})"/>`

    // replacing the table with the add form
    document.getElementById("table").innerHTML = htmlString
}

function modifyTagsData(index) {
    // getting the modified tag value
    let modifiedTag = document.getElementById("modifiedTag").value
    // adding to the uniqueTags array
    uniqueTags[index] = modifiedTag
    displayTagsManager()
}

function deleteTagsModal(chosenTag) {
    document.getElementById("deleteModal").showModal()
    let htmlString = `<h3>Delete</h3><br>
                        <p>Are you sure you want to delete the tag ${chosenTag}?</p><br>
                        <input type="button" value="Cancel" onclick="closeDeleteTagsModal()"/>
                        <input type="button" value="Yes, Delete" onclick="deleteTagsData('${chosenTag}')"/>`
    document.getElementById("delete-content").innerHTML = htmlString
}

function deleteTagsData(chosenTag) {
    // getting index of chosen tag to delete
    let index = uniqueTags.indexOf(chosenTag);
    // deleting 1 item from the uniqueTags array at index index
    uniqueTags.splice(index, 1)
    document.getElementById('deleteModal').close()
    displayTagsManager()
}

function closeDeleteTagsModal() {
    document.getElementById('deleteModal').close()
}

function isNumberValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("number").value.length === 0 || isNaN(document.getElementById("number").value)) {
        errorMessage += "Please enter a number"
    }

    // passed all tests, so it is a valid name
    document.getElementById("numberErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isDescriptionValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("description").value.length === 0) {
        errorMessage += "Please enter a description"
    }

    // passed all tests, so it is a valid name
    document.getElementById("descriptionErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample1TitleValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("example1Title").value.length === 0) {
        errorMessage += "Please enter a title for this example"
    }

    // passed all tests, so it is a valid name
    document.getElementById("example1TitleErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample1DescriptionValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("example1Description").value.length === 0) {
        errorMessage += "Please enter a description for this example"
    }

    // passed all tests, so it is a valid name
    document.getElementById("example1DescriptionErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample1ImageValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("example1Image").value.length === 0) {
        errorMessage += "Please enter a valid image link"
    }

    // passed all tests, so it is a valid name
    document.getElementById("example1ImageErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample1TagValid()
{
    let errorMessage = ""
    // getting the inputted tag
    let inputTag = document.getElementById("example1Tag").value
    // creating an array with only the ipnutted tag if it is already in the uniqueTags array
    let isTagThere = uniqueTags.filter(tag => tag.localeCompare(inputTag) === 0)
    //test to see if the isTagThere array is empty 
    // if it is empty, the tag isnt there
    if (isTagThere.length === 0) {
        errorMessage += "Please enter a valid tag"
    }
    // passed all tests, so it is a valid tag
    document.getElementById("example1TagErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample2TitleValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("example2Title").value.length === 0) {
        errorMessage += "Please enter a title for this example"
    }

    // passed all tests, so it is a valid name
    document.getElementById("example2TitleErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample2DescriptionValid()
{
    let errorMessage = ""
    // test to see if the name is not empty
    if (document.getElementById("example2Description").value.length === 0) {
        errorMessage += "Please enter a description for this example"
    }

    // passed all tests, so it is a valid name
    document.getElementById("example2DescriptionErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample2ImageValid()
{
    let errorMessage = ""
    let image = document.getElementById("example2Image").value
    // test to see if the name is not empty
    if ((image.length === 0) || (!image.includes("http"))) {
        errorMessage += "Please enter a valid image link"
    }
    // passed all tests, so it is a valid name
    document.getElementById("example2ImageErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isExample2TagValid()
{
    let errorMessage = ""
    // getting the inputted tag
    let inputTag = document.getElementById("example2Tag").value
    // creating an array with only the ipnutted tag if it is already in the uniqueTags array
    let isTagThere = uniqueTags.filter(tag => tag.localeCompare(inputTag) === 0)
    //test to see if the isTagThere array is empty
    // if it is empty, the tag isn't there
    if (isTagThere.length === 0) {
        errorMessage += "Please enter a valid tag"
    }
    // passed all tests, so it is a valid tag
    document.getElementById("example2TagErrorMessage").innerHTML = errorMessage
    return (errorMessage.length === 0)
}

function isFormValid()
{
    /* Validate all of the input elements */
    let numberIsValid = isNumberValid()
    let descriptionIsValid = isDescriptionValid()

    let example1Title = isExample1TitleValid()
    let example1Description = isExample1DescriptionValid()
    let example1Image = isExample1ImageValid()
    let example1Tag = isExample1TagValid()

    let example2Title = isExample2TitleValid()
    let example2Description = isExample2DescriptionValid()
    let example2Image = isExample2ImageValid()
    let example2Tag = isExample2TagValid()

    /* If ALL of the element validation functions pass, then the form is valid */
    if (numberIsValid && descriptionIsValid && example1Title && example1Description && example1Image && example1Tag && example2Title && example2Description && example2Image && example2Tag) {
        addData()
        return true
    }
    /* If ANY of the element validation functions fail, then the form fails */
    else {
        return false
    }
}
