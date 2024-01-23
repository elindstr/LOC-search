// handle search button
$("#searchButton").on("click", (event) => {
    event.preventDefault()
    let searchQuery = $("#searchQuery").val()
    let mediaType = $(".form-select").val()
    let urlParameters = `?searchQuery='${searchQuery}'&mediaType='${mediaType}'`

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
    let searchQuery = params.get('searchQuery');
    let mediaType = params.get('mediaType');
    //console.log(searchQuery, mediaType)

    searchQuery? fetchQuery(searchQuery, mediaType): null
})

// fetch searchQuery
function fetchQuery(searchQuery, mediaType) {
    let fetchURL = `https://www.loc.gov/search/?q=${searchQuery}&fo=json`
    console.log(mediaType)
    if (mediaType !== "Any Format") { //TODO: Why isn't this working?
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
            
            let resultsLengthMsg = `Showing ${resultsLength} results:`
            resultsLength === 1? resultsLengthMsg `Showing ${resultsLength} result:`: null   
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

                let sectionBodyContent = data.results[i].description[0]
                let sectionBody = $(`<p>`)
                    .text(sectionBodyContent)

                let sectionButton = $("<button>")
                    .text("View More")
                    .attr("data-url", `${data.results[i].url}`)
                    .attr("class", "btn btn-primary")

                section.append(sectionHead, sectionBody, sectionButton)

                $("article").append(section)
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
