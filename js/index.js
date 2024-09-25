import { debounce } from "./lib.js";
import { getUserData, searchUser } from "./services.js";

const searchInput = document.getElementById("search-input");
const searchingUserList = document.getElementById("searching-user-list");
const userContent = document.querySelector(".user-content");

searchInput.addEventListener("keyup", debounce(searchUserHandler, 500));

window.addEventListener("click", (event) => {
  const valueList = event.target.closest(".searching-user-list");
  if (valueList || event.target === searchInput) return;

  searchingUserList.style.display = "none";
});

async function searchUserHandler(event) {
  const value = event.target.value;

  if (!value) return;

  const searchingUsers = await searchUser(value);

  if (searchingUsers.items.length === 0) {
    return renderUserNotFound();
  }

  renderSearchingUsers(searchingUsers.items);
}

async function onClickSearchingUserHandler(username) {
  const userData = await getUserData(username);

  if (userData) {
    renderUserContent(userData);
  }
}

function renderSearchingUsers(users) {
  if (searchingUserList.hasChildNodes()) {
    searchingUserList.innerHTML = "";
  }

  users.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.addEventListener("click", () =>
      onClickSearchingUserHandler(user.login)
    );

    listItem.textContent = user.login;
    searchingUserList.appendChild(listItem);
  });
  searchingUserList.classList.add("searching-user-list");
  searchingUserList.style.display = "block";
}

function renderUserContent(data) {
  if (userContent.hasChildNodes()) {
    userContent.innerHTML = "";
  }

  const userCard = createUserCard(data.user);
  const reposList = createRepoList(data.repos);

  userContent.append(userCard, reposList);

  searchingUserList.style.display = "none";
  searchingUserList.innerHTML = "";
  searchInput.value = "";
}

function renderUserNotFound() {
  if (userContent.hasChildNodes()) {
    userContent.innerHTML = "";
  }

  const notFound = document.createElement("div");
  notFound.classList.add("user-not-found");
  notFound.textContent = "User not found";

  userContent.appendChild(notFound);
}

function createUserCard(user) {
  const avatarImg = document.createElement("img");
  avatarImg.src = user.avatar_url;
  avatarImg.alt = user.login;

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.appendChild(avatarImg);

  const name = document.createElement("h2");
  name.classList.add("user-name");
  name.textContent = user.login;

  const avatarWrapper = document.createElement("div");
  avatarWrapper.classList.add("user-avatar");
  avatarWrapper.append(avatar, name);

  const repositories = document.createElement("li");
  repositories.classList.add("user-info-item");
  repositories.textContent = `Repositories: ${user.public_repos}`;

  const followers = document.createElement("li");
  followers.classList.add("user-info-item");
  followers.textContent = `Followers: ${user.followers}`;

  const following = document.createElement("li");
  following.classList.add("user-info-item");
  following.textContent = `Following: ${user.following}`;

  const infoList = document.createElement("ul");
  infoList.classList.add("user-info-list");
  infoList.append(repositories, followers, following);

  const card = document.createElement("div");
  card.classList.add("user-card");
  card.append(avatarWrapper, infoList);

  return card;
}

function createRepoList(repos) {
  const repoWrapper = document.createElement("div");
  repoWrapper.classList.add("repo-wrapper");

  const list = document.createElement("ul");
  list.classList.add("repo-list");

  if (repos.length > 5) {
    repoWrapper.style.paddingRight = "5px";
  }

  repos.forEach((repo) => {
    const repoItem = createRepoItem(repo);
    list.appendChild(repoItem);
  });

  repoWrapper.appendChild(list);

  return repoWrapper;
}

function createRepoItem(repo) {
  const repoLink = document.createElement("a");
  repoLink.classList.add("repo-item");
  repoLink.href = repo.html_url;
  repoLink.target = "_blank";
  repoLink.textContent = repo.name;

  const repoItem = document.createElement("li");
  repoItem.appendChild(repoLink);

  return repoItem;
}
