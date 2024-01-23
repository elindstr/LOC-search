
$("button").on("click", (event) => {
    event.preventDefault()
    searchQuery = $("#searchQuery").val()
    mediaType = $("#mediaType").val()
    let urlParameters = `?searchQuery='${searchQuery}'&mediaType='${mediaType}'`
    document.location = "search-results.html" + urlParameters
})

$(function() {
    let params = new URLSearchParams(window.location.search);
    let searchQuery = params.get('searchQuery');
    let mediaType = params.get('mediaType');
    console.log(searchQuery, mediaType)

    if (searchQuery) {
        let fetchURL = `https://www.loc.gov/search/?q='${searchQuery}'&fo=json`
        if (mediaType != "Select format") {
            fetchURL = `https://www.loc.gov/search/?q='${searchQuery}'&fa='${mediaType}'&fo=json`
        }

        console.log("fetchURL:", fetchURL)

        fetch(fetchURL)
            .then(function (response) {
            return response.json()
            })
            .then(function (data) {
            console.log(data)
            })
            .catch(function (error) {
            console.log(error)
            })
    }
})


// * The response from the API request will then be displayed on the page. It is up to you and your team to determine which data should be displayed from the overall `response` object, but you must use data from the `results` property in the `response` object. For more information, see the [Library of Congress API documentation on responses](https://www.loc.gov/apis/json-and-yaml/responses/search-results/).


// * The same form from the homepage should be here as well. Instead of redirecting a user to another page, however, it will perform a search right on the page and display the new results.
