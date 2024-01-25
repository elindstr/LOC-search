// handle search button
$("#searchButton").on("click", (event) => {
    event.preventDefault()
    let searchQuery = $("#searchQuery").val()
    let mediaType = $(".form-select").val()
    let selectorMediaType = $(".form-select").attr("data-value")
    let urlParameters = `?searchQuery='${searchQuery}'&mediaType='${mediaType}'&mediaTypeInput='${selectorMediaType}'`

    let html = document.location.pathname.split("/")
    let htmlFile = html[html.length - 1]
    if (searchQuery) { 
        if (htmlFile === "index.html") { 
            document.location = "search-results.html" + urlParameters
        }
        else {
            $("main header").empty()
            $("article").empty()
            $("main header").append("<h2>")
                .text(`Loading...`) 
            

            fetchQuery(searchQuery, mediaType) 
        }
    }
})

// get search params on load
$(function() {
    let params = new URLSearchParams(window.location.search);
    let searchQuery = params.get('searchQuery').replaceAll("'","")
    let mediaType = params.get('mediaType').replaceAll("'","")
    console.log(searchQuery, mediaType)

    $("#searchQuery").val(`${searchQuery}`)
    $("#mediaType").val(`${mediaType}`)      // TODO: Debug - not working. 

    searchQuery? fetchQuery(searchQuery, mediaType): null
})

// fetch searchQuery
function fetchQuery(searchQuery, mediaType) {
    let fetchURL = `https://www.loc.gov/search/?q=${searchQuery}&fo=json`
    console.log(mediaType)
    if (mediaType !== "Any Format") {
        fetchURL = `https://www.loc.gov/search/?q=${searchQuery}&fa=${mediaType}&fo=json`
    }
    console.log("fetchURL:", fetchURL)

    fetch(fetchURL)
        .then(function (response) {
            if (response.status >= 400) {
                console.log("fetch error")
            }
            else {
                return response.json()
            }
        })
        .then(function (data) {
            console.log(data)
            renderResults(data)
        })
        .catch(function (error) {
            console.log(error)
        })
}

// render results

function renderResults(data) {
    if (data) {
        $("main header").empty
        $("article").empty()

        if (data.results) {
            let resultsLength = data.results.length
            let ofCount = data.pagination.of
            console.log(ofCount)

            let resultsLengthMsg = `Showing ${resultsLength} of ${ofCount.toLocaleString()} results:`
            resultsLength === 1? resultsLengthMsg `Showing ${resultsLength} of ${ofCount} result:`: null   
            $("main header").append("<h2>")
                .text(resultsLengthMsg) 

            for (let i = 0; i < resultsLength; i++) {        
                let section = $("<section>")
                
                let sectionHead = $(`<h2>`)
                if (data.results[i].item) {
                    let sectionHeadContent = data.results[i].item.title
                    sectionHead = $(`<h2>`)
                        .text(sectionHeadContent)
                }

                let image
                if (data.results[i].image_url) {
                    image = $("<img>")
                    .attr("src", data.results[i].image_url[0])
                }


                let dateDiv = $("<div>")
                let dateLabel = $("<span>Date:</span>").attr("class", "bold")
                let dateContent = `<span>${data.results[i].date}</span>`
                dateDiv.append(dateLabel, dateContent)

                let descriptionDiv = $("<div>")
                let descriptionLabel = $("<span>Description:</span>").attr("class", "bold")
                let descriptionContent = `<span>${data.results[i].description[0]}</span>`
                descriptionDiv.append(descriptionLabel, descriptionContent)

                let sectionButton = $("<a>")
                    .text("View More")
                    .attr("class", "btn btn-primary")
                    .attr("href", `${data.results[i].url}`)

                section.append(sectionHead, image, dateDiv, descriptionDiv, sectionButton)

                $("article").append(section)
            }

            // next page
            if (data.pagination.next) {
                let next = data.pagination.next
                let last = data.pagination.last
                let of = data.pagination.of
                $("article").append($("<button>")
                    .text("Next")
                    .attr("id", next)
                    .addClass("next"))
            }
        }
        else {
            console.log("no results to render")
        }

    } 
    else {
        console.log("no data to render")
    }
}

$("body").on("click", "button .next", function () {
    url = $(this).attr("id")
    console.log("click", url)

    fetch(url)
        .then(function (response) {
            if (response.status >= 400) {
                console.log("fetch error")
            }
            else {
                return response.json()
            }
        })
        .then(function (data) {
            console.log(data)
            renderResults(data)
        })
        .catch(function (error) {
            console.log(error)
        })
})

$("body").on("click", "button .next", function () {
    url = $(this).attr("id")
    console.log("click", url)

    fetch(url)
        .then(function (response) {
            if (response.status >= 400) {
                console.log("fetch error")
            }
            else {
                return response.json()
            }
        })
        .then(function (data) {
            console.log(data)
            renderResults(data)
        })
        .catch(function (error) {
            console.log(error)
        })
})
