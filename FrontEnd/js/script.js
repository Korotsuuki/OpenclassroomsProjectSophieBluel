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

    filters.style.display = "none"

    logout.addEventListener("click", () => {

        window.sessionStorage.loged = false

    })

}




const modalContent = document.querySelector("#modalcontent");

const modalProjets = document.querySelector(".modalprojets");

const buttonAddPhoto = document.querySelector(".containerbtn button");

const ctnModals = document.querySelector(".containermodals");

const paragraphFile = document.querySelector("#formaddworks p");






function displayModal() {

    const modeEdition = document.querySelector(".admin")

    modeEdition.addEventListener("click", () => {

        modalContent.style.display = "flex"

    });

    

}

displayModal()


function closeModal() {

    const cross1 = document.querySelector(".cross1")

    cross1.addEventListener("click", () => {

        modalContent.style.display ="none"

    });


    modalContent.addEventListener("click", (e) => {

        console.log(e.target.id);

        if (e.target.id == "modalcontent") {

            modalContent.style.display = "none"

        }

    });

}

closeModal()


function closeAddWorks() {

    const cross2 = document.querySelector(".cross2")

    cross2.addEventListener("click", () => {

        modalContent.style.display ="none"

    });

}

closeAddWorks()


function openAddWorks() {

    buttonAddPhoto.addEventListener("click", () => {

        ctnModals.style.display = "none"

        modalAddWorks.style.display = "flex"

        

    });

}

openAddWorks()


function returnfirstModal() {

    const leftArrow = document.querySelector(".arrow-left")

    leftArrow.addEventListener("click", () => {

        modalAddWorks.style.display = "none"

        ctnModals.style.display = "flex"

    });

}

returnfirstModal()


async function displayWorksModal() {

    const works = await getWorks();

    works.forEach((work) => {

        createWorks(work);

    })

    deleteWork()

}

displayWorksModal()


function createWorks(work) {

    const figure = document.createElement("figure");

    const img = document.createElement("img");

    const span = document.createElement("span");

    const trash = document.createElement("i")

    trash.classList.add("fa-solid", "fa-trash-can")

    trash.id = work.id

    img.src = work.imageUrl

    span.appendChild(trash)

    figure.appendChild(span)

    figure.appendChild(img)

    modalProjets.appendChild(figure)

}


function deleteWork() {

    const trashAll = document.querySelectorAll(".fa-trash-can")

    trashAll.forEach(trash => {

        trash.addEventListener("click", (e) => {

            e.preventDefault();

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

                if (response.ok) {

                    displayProjets();
                    displayWorksModal();
                    window.location.reload();
                }

                if (!response.ok) {

                    console.log("Le delete n'a pas marché !");

                }

            })

        })

    });

}


const modalAddWorks = document.querySelector(".modaladdworks");

const validateButton = document.querySelector(".button-add-work");

const inputTitle = document.querySelector("#title");

const categorySelect = document.querySelector("#categoryinput");

const inputFile = document.querySelector("#file");

const addPhotoButton = document.querySelector(".labelfile");

const modalErrorMessage = document.getElementById("modal-error");

const formAddWorks = document.querySelector("#formaddworks");


function updateButton() {

    if (previewImage.style.display !== "none" && inputTitle.value.trim() !=="" && inputCategory.value !== "") {

        validateButton.style.background = "#1D6154";

    } else {

        validateButton.style.background = "";

    }

}






formAddWorks.addEventListener("submit", function (e) {

    e.preventDefault();


    const formData = new FormData();


    formData.append("title", document.getElementById("title").value);

    formData.append("category", document.getElementById("categoryinput").value);


    formData.append("image", inputFile.files[0]);


    fetch("http://localhost:5678/api/works", {

        method: "POST",

        headers: {

            Authorization: `Bearer ${token}`,

        },

        body: formData

    })

    .then((response) => {

        if (response.ok) {
            
            displayProjets();
            displayWorksModal();
            window.location.reload();
        }

        if (!response.ok) {

            throw new Error("Échec de la création du projet:" + response.statusText);

        }

        return response.json();

    })

    .catch((error) => {

        console.error("Erreur:", error)

    });

})


function displaySelectedImage(event) {

    event.preventDefault();

    const file = event.target.files[0];

    const containeraddphoto = document.getElementsByClassName("containeraddphoto");

    const newImage = document.createElement('img');

    containeraddphoto[0].appendChild(newImage);

    if (file) {

        const reader = new FileReader();


        reader.onload = function(e) {


            const imgSrc = e.target.result; 


            if (newImage) {

                newImage.src = imgSrc;

                newImage.style.display = 'block';

                newImage.style.width = '100%';


            } else {

                console.error('Preview image element not found.');

            }

        };


        reader.readAsDataURL(file);

    }

}


inputFile.addEventListener('change', displaySelectedImage);

