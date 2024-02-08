const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const token = window.sessionStorage.getItem("accessToken");

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}
getWorks();

async function displayProjets() {
    const projets = await getWorks();
    projets.forEach((projet) => {
        createProjets(projet);
    })
}
displayProjets();

function createProjets(projet) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = projet.imageUrl;
    figcaption.textContent = projet.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

async function displayCatBtn() {
    const categories = await getCategories();
    console.log(categories);
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
    });
}
displayCatBtn();

async function filterCategory() {
    const projets = await getWorks()
    console.log(projets);
    const buttons = document.querySelectorAll(".filters button")
    console.log(buttons);
    buttons.forEach(button => {
        button.addEventListener("click",(e)=>{
            btnId =e.target.id;
            gallery.innerHTML = "";
            if (btnId !== "0") {
                const projetsTriCat = projets.filter((projet) => {
                    return projet.categoryId == btnId;
                });
                projetsTriCat.forEach(projet => {
                    createProjets(projet)
                });
            }else{
                displayProjets()
            }
            console.log(btnId);
        })
    });
}
filterCategory();

const loged = window.sessionStorage.loged;
const admin = document.querySelector(".admin");
const logout = document.querySelector(".logout");
const blackBand = document.querySelector(".blackband");
const header = document.querySelector("header");

if (loged == "true") {
    admin.style.display = "block";
    blackBand.style.display = "flex"
    header.style.margin = "100px 0"
    logout.textContent = "logout";
    logout.addEventListener("click", () => {
        window.sessionStorage.loged = false
    })
}


const modalContent = document.querySelector("#modalcontent");
const modalProjets = document.querySelector(".modalprojets");
const buttonAddPhoto = document.querySelector(".containerbtn button");
const ctnModals = document.querySelector(".containermodals");
const modalAddWorks = document.querySelector(".modaladdworks");
const formAddWorks = document.querySelector("#formaddworks");
const labelFile = document.querySelector("#formaddworks label")
const paragraphFile = document.querySelector("#formaddworks p")
const inputTitle = document.querySelector("#title");
const inputCategory = document.querySelector("#categoryinput");
const inputFile = document.querySelector("#file");
const previewImage = document.getElementById("previewimage");

function displayModal() {
    const modeEdition = document.querySelector(".admin");
    modeEdition.addEventListener("click", () => {
      modalContent.style.display = "flex";
      ctnModals.style.display = "flex";
      modalAddWorks.style.display = "none";
    });
}
displayModal()

async function displayWorksModal() {
    modalProjets.innerHTML = "";
    const works = await getWorks()
    works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span")
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    img.src = work.imageUrl;
    img.alt = work.title;
    span.appendChild(trash)
    figure.appendChild(img);
    figure.appendChild(span);
    modalProjets.appendChild(figure);
    });
    deleteWork()
}
displayWorksModal()


function closeModalProjets() {
    const cross1 = document.querySelector(".containermodals span .fa-xmark");
    cross1.addEventListener("click", () => {
        modalContent.style.display = "none";
    });

    const cross2 = document.querySelector(".modaladdworks span .fa-xmark");
    cross2.addEventListener("click", () => {
        inputFile.value = "";
        modalContent.style.display = "none";
    });

    modalContent.addEventListener("click", (e) => {
        console.log(e.target.id);
       if (e.target.id == "modalcontent") {
        inputFile.value = "";
        modalContent.style.display = "none";
       }
    })
}
closeModalProjets()

function deleteWork() {
    const trashAll = document.querySelectorAll(".fa-trash-can")
    trashAll.forEach(trash => {
        trash.addEventListener("click", (e) => {
            id = trash.id
            const init = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-Type":"application/json",
                },
            }
            fetch("http://localhost:5678/api/works/" +id,init)
            .then((response) => {
                if (!response.ok) {
                    console.log("Le delete n'a pas marché !");
                }
            })
        })
    });
}

function displayModalAddWorks() {
    buttonAddPhoto.addEventListener("click", () => {
        ctnModals.style.display = "none";
        modalAddWorks.style.display = "flex";
    });
}
displayModalAddWorks()

function returnToModalPortfolio() {
    const arrowLeftModalWorks = document.querySelector(
      ".modaladdworks span .fa-arrow-left"
    );
    arrowLeftModalWorks.addEventListener("click", () => {
      ctnModals.style.display = "flex";
      modalAddWorks.style.display = "none";
    });
}

function addWorks() {
    formAddWorks.addEventListener("submit", (e) => {
      e.preventDefault();
      // Récupération des Valeurs du Formulaire
      const formData = new FormData(formAddWorks);
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi du fichier");
          }
          return response.json();
        })
        .then((data) => {
          displayWorksModal();
          formAddWorks.reset();
          ctnModals.style.display = "flex";
          modalAddWorks.style.display = "none";
          previewImage.style.display = "none";
        })
        .catch((error) => {
          console.error("Erreur :", error);
        });
    });
}

async function displayCategoryModal() {
    const select = document.querySelector("form select");
    const categorys = await getCategory();
    categorys.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
}

function verifFormCompleted() {
    const buttonValidForm = document.querySelector(
      ".container-button-add-work  button"
    );
    formAddWorks.addEventListener("input", () => {
      if (!inputTitle.value == "" && !inputFile.files[0] == "") {
        buttonValidForm.classList.remove("button-add-work");
        buttonValidForm.classList.add("buttonValidForm");
      } else {
        buttonValidForm.classList.remove("buttonValidForm");
        buttonValidForm.classList.add("button-add-work");
      }
    });
}