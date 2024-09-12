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


function handleFormSubmit(e) {
  e.preventDefault();
  if (validatForm()) {

    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const releaseYear = document.getElementById("releaseYear").value;
    const isWatched = document.getElementById("isWatched").checked;

    const film = {
      title: title,
      genre: genre,
      releaseYear: releaseYear,
      isWatched: isWatched,
    };

    addFilm(film);
  }
}

async function addFilm(film) {
  // const films = JSON.parse(localStorage.getItem("films")) || [];
  // films.push(film);
  // localStorage.setItem("films", JSON.stringify(films));

  // console.log(film);
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: "ovikdevil@gmail.com",
    },
    body: JSON.stringify(film),
  });

  renderTable();
}

async function renderTable() {
  // const films = JSON.parse(localStorage.getItem("films")) || [];
  const filmsResponse = await fetch("https://sb-film.skillbox.cc/films", {
    headers: {
      email: "ovikdevil@gmail.com",
    },
  });
  const films = await filmsResponse.json();

  const filmTableBody = document.getElementById("film-tbody");

  // Clear table body first
  filmTableBody.innerHTML = "";

  // Then add new rows
  films.forEach((film, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td id="td-title">${film.title}</td>
      <td id="td-genre">${film.genre}</td>
      <td id="td-releaseYear">${film.releaseYear}</td>
      <td id="td-isWatched">${film.isWatched ? "Да" : "Нет"}</td>
      <td><button id="delete-button">Удалить</button></td>
    `;
    filmTableBody.appendChild(row);
    const deleteButtons = document.querySelectorAll("#delete-button");
    for (let i = deleteButtons.length; i <= deleteButtons.length; i++) {
      const element = deleteButtons[i - 1];
      element.addEventListener("click", function (e) {
        deleteFilm(film.id);
      })
    }
  });
}

async function clearAllFilms() {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "DELETE",
    headers: {
      email: "ovikdevil@gmail.com",
    }
  })

  renderTable()
}

async function deleteFilm(id) {
  await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
    method: "DELETE",
    headers: {
      email: "ovikdevil@gmail.com",
    }
  })
  renderTable()
}

async function filterTable() {

  const filterTitle = document.querySelector("#filter-title").value;
  const filterGenre = document.querySelector("#filter-genre").value;
  const filterReleaseYear = document.querySelector("#filter-releaseYear").value;
  const filterType = document.querySelector("#filter-select").value;

  let filmResponse;

  switch (filterType) {
    case "All": {
      filmResponse = await fetch(`https://sb-film.skillbox.cc/films/?title=${filterTitle}&genre=${filterGenre}&releaseYear=${filterReleaseYear}`, {
        headers: {
          email: "ovikdevil@gmail.com",
        },
      });
      break;
    }
    case "title": {
      filmResponse = await fetch(`https://sb-film.skillbox.cc/films/?title=${filterTitle}`, {
        headers: {
          email: "ovikdevil@gmail.com",
        },
      });
      break;
    }
    case "genre": {
      filmResponse = await fetch(`https://sb-film.skillbox.cc/films/?genre=${filterGenre}`, {
        headers: {
          email: "ovikdevil@gmail.com",
        },
      });
      break;
    }
    case "releaseYear": {
      filmResponse = await fetch(`https://sb-film.skillbox.cc/films/?releaseYear=${filterReleaseYear}`, {
        headers: {
          email: "ovikdevil@gmail.com",
        },
      });
      break;
    }
    default: {
      console.log("Проверьте условия фильтрации")
    }
  }
  const filmTableBody = document.getElementById("film-tbody");

  // Clear table body first
  filmTableBody.innerHTML = "";

  const films = await filmResponse.json();
  // Then add new rows
  films.forEach((film, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.genre}</td>
      <td>${film.releaseYear}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
      <td><button id="delete-button">Удалить</button></td>
      `;
    filmTableBody.appendChild(row);
    const deleteButtons = document.querySelectorAll("#delete-button");
    for (let i = deleteButtons.length; i <= deleteButtons.length; i++) {
      const element = deleteButtons[i - 1];
      element.addEventListener("click", function (e) {
        deleteFilm(film.id);
      })
    }
  });
}



document
  .getElementById("film-form")
  .addEventListener("submit", handleFormSubmit);

document
  .getElementById("filter-title")
  .addEventListener("input", filterTable);
document
  .getElementById("filter-genre")
  .addEventListener("input", filterTable);
document
  .getElementById("filter-releaseYear")
  .addEventListener("input", filterTable);
document
  .getElementById("filter-select")
  .addEventListener("change", filterTable);

document
  .getElementById("clear-button")
  .addEventListener("click", clearAllFilms);

// Display films on load
renderTable()