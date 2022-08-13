const inputElem = document.querySelector(".write_input");
const mainAllElem = document.querySelector(".all_list");
const empty = document.querySelector(".empty");
const all = document.querySelector(".all");
const pending = document.querySelector(".pending");
const completed = document.querySelector(".completed");
const clearAll = document.querySelector(".clear_all");
clearAll.addEventListener("click", clearItems);
all.addEventListener("click", showAllItem);
pending.addEventListener("click", showPendingItem);
completed.addEventListener("click", showCompleteItem);

let pendingArray = [];
let completeArray = [];
inputElem.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value && this.value.trim()) {
        if (this.getAttribute("data-edit")) {
            const textEdit = document.querySelector(`.all_list p[data-edit=${this.getAttribute("data-edit")}]`);
            textEdit.textContent = this.value;
            this.value = "";
            this.setAttribute("data-edit", "")
            return;
        }
        createElems(this.value);
        this.value = "";
        empty.classList.add("d-none");
    }
});

let counter = 0;
function createElems(inputValueText) {
    let itemBox = createDomElement("div", {
        class: "item_box",
        "data-delete": `text${counter}`,
    }, createDomElement("input", {
        type: "checkbox",
        listeners: {
            change: checkCheckbox
        }
    }), createDomElement("p", {
        class: "item_text",
        "data-edit": `text${counter}`,
    }, inputValueText), createDomElement("div", {
        class: "item_tools",
    }, createDomElement("i", {
        class: "fa-solid fa-ellipsis icon_click",
        listeners: {
            click: toggleSubMenu
        }
    }), createDomElement("ul", {
        class: "sub_tools d-none",
    }, createDomElement("li", {
        "data-edit": `text${counter}`,
        listeners: {
            click: editing
        }
    }, createDomElement("i", {
        class: "fa-light fa-pencil",
    }), createDomElement("a", {
        href: "#",
    }, "Edit")), createDomElement("li", {
        "data-delete": `text${counter}`,
        listeners: {
            click: deleting
        }
    }, createDomElement("i", {
        class: "fa-regular fa-trash"
    }), createDomElement("a", {
        href: "#",
    }, "Delete")))));
    mainAllElem.appendChild(itemBox);
    pendingArray.push(itemBox);
    counter++;
}

function toggleSubMenu() {
    const subMenu = this.nextElementSibling;
    const subMenuAll = document.querySelectorAll(".sub_tools");
    subMenuAll.forEach((elem) => {
        if (elem != subMenu) {
            elem.classList.add("d-none");
        }
    })
    subMenu.classList.toggle("d-none");
}

function checkCheckbox() {
    if (this.checked) {
        this.nextElementSibling.classList.add("text-line-through");
        completeArray.push(this.parentElement);
        pendingArray.splice(pendingArray.indexOf(this.parentElement), 1);
    } else {
        this.nextElementSibling.classList.remove("text-line-through");
        pendingArray.push(this.parentElement);
        completeArray.splice(completeArray.indexOf(this.parentElement), 1);
    }
    (all.className.includes("active")) ? update([], pendingArray.concat(completeArray), all) : (pending.className.includes("active")) ? update(completeArray, pendingArray, pending) : update(pendingArray, completeArray, completed)
}

function update(elemHide, elemShow, thisManuActive) {
    elemHide.forEach(elem => {
        elem.classList.add("d-none");
    });
    elemShow.forEach(elem => {
        elem.classList.remove("d-none");
    });
    const menus = Object.values(thisManuActive.parentElement.children);
    menus.forEach(e => {
        e.classList.remove("active");
    });
    thisManuActive.classList.add("active");
    if (completeArray.length === 0 && completed.className.includes("active") || pendingArray.length === 0 && pending.className.includes("active") || mainAllElem.children.length === 1) {
        empty.classList.remove("d-none");
    } else {
        empty.classList.add("d-none");
    }
}

function showPendingItem() {
    update(completeArray, pendingArray, this);
}

function showCompleteItem() {
    update(pendingArray, completeArray, this);
}

function showAllItem() {
    update([], pendingArray.concat(completeArray), this);
}

function editing() {
    const saveThisElem = document.querySelector(`[data-edit=${this.getAttribute("data-edit")}]`);
    inputElem.value = saveThisElem.textContent
    inputElem.setAttribute("data-edit", saveThisElem.getAttribute("data-edit"));
    inputElem.focus();
    toggleSubMenu(this.parentElement.parentElement.firstElementChild);
}

function deleting() {
    const saveThisElem = document.querySelector(`[data-delete=${this.getAttribute("data-delete")}]`);
    if (saveThisElem.firstElementChild.checked) {
        completeArray.splice(completeArray.indexOf(saveThisElem), 1);
    } else {
        pendingArray.splice(pendingArray.indexOf(saveThisElem), 1);
    }
    saveThisElem.remove();
    if (mainAllElem.children.length === 1) {
        empty.classList.remove("d-none");
    } else {
        empty.classList.add("d-none");
    }
    console.log(mainAllElem.children.length);
}

function clearItems() {
    const allItems = Object.values(mainAllElem.children);
    allItems.forEach(e => {
        if (!e.className.includes("empty")) {
            e.remove();
        }
    })
    empty.classList.remove("d-none");
}