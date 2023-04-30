//Brian Luing
//4/23/2023
//INF651
//Final Project

// Function 1
function createElemWithText(elemStrName = "p", textContent = "", className) {
    const myElement = document.createElement(elemStrName);
    myElement.textContent = textContent;
    if (className) myElement.classList.add(className);
    return myElement;
}

// Function 2
function createSelectOptions(json_data) {
    if (!json_data)
        return;

    let arr = [];
    json_data.forEach(user => {
        let element = document.createElement("option");
        element.value = user.id;
        element.textContent = user.name;
        arr.push(element);
    });
    return arr;
}

// Function 3
function toggleCommentSection(postId) {
    if (!postId) return;
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
        section.classList.toggle("hide");
    }
    return section;
}

// Function 4
const toggleCommentButton = (postId) => {
    if (!postId) {
        return;
    }
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button === null) {
        return null;
    }
    if (button.textContent === "Show Comments") {
        button.textContent = "Hide Comments";
    } else {
        button.textContent = "Show Comments";
    }
    return button;
};

// Function 5
function deleteChildElements(parentElement) {
    if (!parentElement?.tagName) return;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// Function 6
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    for (const button of buttons) {
        const postId = button.dataset.postId;
        button.addEventListener(
            "click",
            function (event) {
                toggleComments(event, postId);
            },
            false
        );
    }
    return buttons;
}

// Function 7
const removeButtonListeners = () => {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        buttons.forEach((button) => {
            const postId = button.dataset.postId;
            button.removeEventListener("click", function (event) {
                toggleCommentSection(event, postId);
            });
            return button;
        });
        return buttons;
    }
};

// Function 8
const createComments = (comments) => {
    if (!comments) {
        return;
    }
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
        const articleElement = document.createElement("article");
        const h3Element = createElemWithText("h3", comment.name);
        const paragraphElement = createElemWithText("p", comment.body);
        const paragraphElement2 = createElemWithText("p", `From: ${comment.email}`);
        articleElement.append(h3Element, paragraphElement, paragraphElement2);
        fragment.append(articleElement);
    });
    return fragment;
};


// Function 9
function populateSelectMenu(users) {
    if (!users) return;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    for (let option of options) {
        selectMenu.append(option);
    }
    return selectMenu;
}

// Function 10
const getUsers = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const requestedUserData = await response.json();
        return requestedUserData;
    } catch (error) {
        console.error(error.stack);
    }
};

// Function 11
const getUserPosts = async (userId) => {
    if (!userId) {
        return;
    }
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const requestedUserDataPost = await response.json();
        return requestedUserDataPost;
    } catch (error) {
        console.error(error.stack);
    }
};

// Function 12
async function getUser(userId) {
    if (!userId) return;
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        const jsonUserData = await response.json();
        return jsonUserData;
    } catch (e) {
        console.error(e);
    }
}

// Function 13
async function getPostComments(postId) {
    if (!postId) return;
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
        );
        const jsonUserData = await response.json();
        return jsonUserData;
    } catch (e) {
        console.error(e);
    }
}


// Function 14
async function displayComments(postId) {
    if (!postId) return;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments");
    section.classList.add("hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}

// Function 15
const createPosts = async (posts) => {
    if (!posts) {
        return;
    }
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement("article");
        const h2 = createElemWithText("h2", post.title);
        const paragraph = createElemWithText("p", post.body);
        const paragraph2 = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const paragraph3 = createElemWithText(
            "p",
            `Author: ${author.name} with ${author.company.name}`
        );
        const paragraph4 = createElemWithText("p", `${author.company.catchPhrase}`);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        button.setAttribute("postId", `${button.dataset.postId}`);
        const section = await displayComments(post.id);
        article.append(
            h2,
            paragraph,
            paragraph2,
            paragraph3,
            paragraph4,
            button,
            section
        );
        fragment.append(article);
    }
    return fragment;
};

// Function 16
async function displayPosts(posts) {
    let mainElem = document.querySelector("main");
    let element = await posts
        ? await createPosts(posts)
        : createElemWithText(
            "p",
            "Select an Employee to display their posts.",
            "default-text"
        );
    mainElem.append(element);
    return element;
}

// Function 17
function toggleComments(event, postId) {
    if (!event || !postId) return;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// Function 18
async function refreshPosts(posts) {
    if (!posts) return;
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = document.createDocumentFragment();
    fragment.append(await displayPosts(posts));
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

// Function 19
async function selectMenuChangeEventHandler(event) {
    if (!event) return;
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.setAttribute("disabled", true);
    const userId = event?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.removeAttribute("disabled");
    return [userId, posts, refreshPostsArray];
}

// Function 20
async function initPage() {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}

// Function 21
const initApp = () => {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", function (event) { selectMenuChangeEventHandler(event) })
};