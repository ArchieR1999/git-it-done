var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container")
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
            console.log(data);
            displayRepos(data, user);
        });
    } else {
    alert("Error: GitHub User Not Found. Please Enter A Valid GitHub Username.");
    }
    })

    // catch network errors 
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });

};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        // clear old content 
        repoContainerEl.textContent = '';
        nameInputEl.value = '';
    } else {
        alert("Please enter a valid GitHub username.")
    }
};

// langauge parameter api endpoint function
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub User Not Found.');
        }
    });
};
    
var displayRepos = function(repos, searchTerm) {
    // check if api returned ANY repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "This User Has No Repositories. Recommend They Get Some 😉.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);
    repoSearchTerm.textContent = searchTerm;

    

    // loop over repos
    for (var i=0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container 
    repoEl.appendChild(titleEl);

    // create status element 
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if the current repo has issues or not
    if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML = 
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";        
    } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    // append to container
    repoEl.appendChild(statusEl);

    // append container to the DOM 
    repoContainerEl.appendChild(repoEl);
    }

};

// buttonclickhandler 
var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    // if statement to trigger event
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
}


userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
