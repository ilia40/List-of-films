const validator = new JustValidate('#film-form');


validator.addField(("#title"), [
    {
        rule: 'required',
        errorMessage: 'Заполните поле названия',
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Поле названия должно содержать минимум 3 символа'
    },

])
validator.addField(("#genre"), [
    {
        rule: 'required',
        errorMessage: 'Заполните поле жанра'
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Поле жанра должно содержать минимум 3 символа'
    },
])
validator.addField(("#releaseYear"), [
    {
        rule: 'required',
        errorMessage: 'Заполните поле год'
    },
    {
        rule: 'minLength',
        value: 4,
        errorMessage: 'Год должен содержать 4 цифры (например, 2000)'
    },
    {
        rule: 'maxLength',
        value: 4,
        errorMessage: 'Год должен содержать 4 цифры (например, 2000)'
    },
    {
        rule: 'number',
        errorMessage: 'Год должен содержать только цифры'
    },
])

function validatForm() {
    const title = document.querySelector("#title").value;
    const genre = document.querySelector("#genre").value;
    const releaseYear = document.querySelector("#releaseYear").value;

    if (!/\d{4}/.test(releaseYear)) {
        return false
    }
    if (title === "" || genre === "" || releaseYear === "") {
        return false;
    }
    return true;
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (validatForm()) {

        const films = JSON.parse(localStorage.getItem("films")) || [];

        const title = document.querySelector("#title").value;
        const genre = document.querySelector("#genre").value;
        const releaseYear = document.querySelector("#releaseYear").value;
        const isWatched = document.querySelector("#isWatched").checked;
        if (!/\d{4}/.test(releaseYear)) {
            return false
        }
        const film = {
            id: films.length,
            title,
            genre,
            releaseYear,
            isWatched
        }

        addFilmToLocalStorage(film);
        document.querySelector("#title").value = "";
        document.querySelector("#genre").value = "";
        document.querySelector("#releaseYear").value = "";
        document.querySelector("#isWatched").checked = false;
    }
}


function addFilmToLocalStorage(film) {
    const films = JSON.parse(localStorage.getItem("films")) || [];
    films.push(film);
    localStorage.setItem("films", JSON.stringify(films));

    renderTable(JSON.parse(localStorage.getItem("films")) || []);
}

function renderTable(films) {

    const filmTableBody = document.querySelector("#film-tbody");

    filmTableBody.innerHTML = "";

    films.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td id="td-title">${element.title}</td>
        <td id="td-genre">${element.genre}</td>
        <td id="td-releaseYear">${element.releaseYear}</td>
        <td id="td-isWatched">${element.isWatched ? "Да" : "Нет"}</td>
        <td>
            <button class="edit-button">Редактировать</button>
            <button class="delete-button">Удалить</button>
        </td>
        `;
        filmTableBody.appendChild(row);
        document.querySelectorAll(".delete-button").forEach(element => {
            element.addEventListener("click", removeFilm);
        });
        document.querySelectorAll(".edit-button").forEach(element => {
            element.addEventListener("click", editFilm);
        });
    });
}

document.querySelector("#film-form").addEventListener("submit", handleFormSubmit);
document.querySelector(".button-sort").addEventListener("click", sortFilms);

renderTable(JSON.parse(localStorage.getItem("films")) || []);

function removeFilm(e) {
    if (document.querySelector(".button-render")) document.querySelector(".button-render").remove()
    if (document.querySelector(".button-cancel")) document.querySelector(".button-cancel").remove()
    const films = JSON.parse(localStorage.getItem("films")) || [];
    const filmTitle = e.target.parentNode.parentNode.querySelector("#td-title").textContent;
    const newFilms = films.filter(film => film.title !== filmTitle)
    localStorage.setItem("films", JSON.stringify(newFilms));
    renderTable(JSON.parse(localStorage.getItem("films")) || []);
}

function editFilm(e) {
    if (document.querySelector(".button-render")) document.querySelector(".button-render").remove()
    if (document.querySelector(".button-cancel")) document.querySelector(".button-cancel").remove()

    const filmTitle = e.target.parentNode.parentNode.querySelector("#td-title").textContent;
    const filmGenre = e.target.parentNode.parentNode.querySelector("#td-genre").textContent;
    const filmReleaseYear = e.target.parentNode.parentNode.querySelector("#td-releaseYear").textContent;
    const filmIsWatched = e.target.parentNode.parentNode.querySelector("#td-isWatched").textContent;

    const title = document.querySelector("#title");
    const genre = document.querySelector("#genre");
    const releaseYear = document.querySelector("#releaseYear");
    const isWatched = document.querySelector("#isWatched");

    title.value = filmTitle;
    genre.value = filmGenre;
    releaseYear.value = filmReleaseYear;
    isWatched.checked = (filmIsWatched === "Да") ? true : false;
    document.querySelector(".submit").style.visibility = "hidden";

    const filmForm = document.querySelector("#film-form");
    const buttonCancel = document.createElement("button");
    buttonCancel.type = "button";
    buttonCancel.textContent = "Отменить редактирование";
    buttonCancel.classList.add("button-cancel");
    const buttonRender = document.createElement("button");
    buttonRender.type = "button";
    buttonRender.classList.add("button-render");
    buttonRender.textContent = "Обновить";
    buttonRender.style.display = "block";
    buttonRender.addEventListener("click", acceptChange);
    buttonCancel.addEventListener("click", cancelChange);
    filmForm.append(buttonRender, buttonCancel)

    localStorage.setItem("titleEditFilm", filmTitle);
}

function acceptChange() {
    const films = JSON.parse(localStorage.getItem("films")) || [];
    const filmTitle = localStorage.getItem("titleEditFilm");
    const film = films.find(film => film.title === filmTitle);

    const title = document.querySelector("#title").value;
    const genre = document.querySelector("#genre").value;
    const releaseYear = document.querySelector("#releaseYear").value;
    if (!/^\d{4}$/.test(releaseYear)) {
        return false
    } else {
        const isWatched = document.querySelector("#isWatched").checked;

        const editFilm = {
            id: film.id,
            title,
            genre,
            releaseYear,
            isWatched
        }
        films[film.id] = editFilm;
        localStorage.setItem("films", JSON.stringify(films));

        renderTable(JSON.parse(localStorage.getItem("films")) || []);
        cancelChange()
    }
}

function cancelChange() {
    document.querySelector("#title").value = "";
    document.querySelector("#genre").value = "";
    document.querySelector("#releaseYear").value = "";
    document.querySelector("#isWatched").checked = false;
    document.querySelector(".submit").style.visibility = "visible";
    document.querySelector(".button-render").remove()
    document.querySelector(".button-cancel").remove()
}

function sortFilms() {
    const films = JSON.parse(localStorage.getItem("films")) || [];
    let sortedFilms = [];
    const valueSort = document.querySelector("#sortBy").value;
    console.log(valueSort);
    if (valueSort === "title") {
        sortedFilms = films.sort((a, b) => a.title.localeCompare(b.title))
    }
    if (valueSort === "releaseYear") {
        sortedFilms = films.sort((a, b) => a.releaseYear - b.releaseYear)
    }
    if (valueSort === "genre") {
        sortedFilms = films.sort((a, b) => a.genre.localeCompare(b.genre))
    }

    renderTable(sortedFilms);

}