import { getUserData } from "./services.js";

export async function renderUserContent(username) {
  const userContent = document.querySelector(".user-content");

  const userData = await getUserData(username);

  if (userContent.hasChildNodes()) {
    userContent.innerHTML = "";
  }

  const userCard = createUserCard(userData.user);
  const reposList = createRepoList(userData.repos);

  userContent.append(userCard, reposList);

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
}
