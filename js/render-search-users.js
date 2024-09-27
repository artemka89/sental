import { debounce } from "./lib.js";
import { getUserData, searchUser, USER_PER_PAGE } from "./services.js";

export function renderSearchUsers(renderUserContent) {
  const searchInput = document.getElementById("search-input");
  const searchingUserWrapper = document.getElementById(
    "searching-user-wrapper"
  );
  const searchingUserList = document.getElementById("searching-user-list");
  const searchingUserListEndElement = document.getElementById("end-element");

  searchInput.addEventListener("keyup", debounce(onSearchUserHandler, 500));

  let CURRENT_PAGE_NUMBER = 1;
  let TOTAL_PAGES = 1;

  let isLoadingSearch = false;
  let currentUserName = "";

  async function onSearchUserHandler(event) {
    currentUserName = event.target.value;

    const observer = new IntersectionObserver(addNextSearchingUsers, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });
    observer.observe(searchingUserListEndElement);

    if (currentUserName) {
      isLoadingSearch = true;
      const users = await searchUser(currentUserName, CURRENT_PAGE_NUMBER);
      isLoadingSearch = false;

      const totalCount = users.total_count;

      if (!totalCount) {
        setSearchingUsersPopup("close", users.items);
      }

      TOTAL_PAGES = Math.ceil(totalCount / USER_PER_PAGE);
      setSearchingUsersPopup("open", users.items);
      return;
    }

    setSearchingUsersPopup("close");
    observer.disconnect();
  }

  async function onClickSearchingUserHandler(event) {
    if (event.target.tagName !== "LI") {
      return;
    }

    const username = event.target.textContent;

    const userData = await getUserData(username);

    if (userData) {
      renderUserContent(userData);
    }
  }

  function onClickWithOutSearchingUserList(event) {
    const valueList = event.target.closest(".searching-user-list");
    if (valueList || event.target === searchInput) return;

    setSearchingUsersPopup("close");
  }

  function addNextSearchingUsers(entries) {
    if (isLoadingSearch || TOTAL_PAGES < CURRENT_PAGE_NUMBER) return;

    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        CURRENT_PAGE_NUMBER += 1;

        isLoadingSearch = true;
        const users = await searchUser(currentUserName, CURRENT_PAGE_NUMBER);
        isLoadingSearch = false;

        setSearchingUsersPopup("add", users.items);
      }
    });
  }

  async function setSearchingUsersPopup(status, users) {
    switch (status) {
      case "open":
        window.addEventListener("click", onClickWithOutSearchingUserList);

        searchingUserList.addEventListener(
          "click",
          onClickSearchingUserHandler
        );

        searchingUserWrapper.scrollTop = 0;
        searchingUserList.innerHTML = "";

        renderSearchingUserList(users);
        searchingUserWrapper.style.display = "block";
        break;

      case "add":
        renderSearchingUserList(users);
        break;

      case "close":
        searchingUserWrapper.scrollTop = 0;
        searchingUserWrapper.style.display = "none";
        searchingUserList.innerHTML = "";
        searchingUserList.removeEventListener(
          "click",
          onClickSearchingUserHandler
        );

        window.removeEventListener("click", onClickWithOutSearchingUserList);
        break;

      default:
        searchingUserWrapper.style.display = "none";
        searchingUserList.innerHTML = "";
        break;
    }
  }

  function renderSearchingUserList(users) {
    if (users.length === 0) {
      const listItem = document.createElement("div");
      listItem.classList.add("searching-user-not-found");
      listItem.textContent = "No users found";
      searchingUserList.appendChild(listItem);
    } else {
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = user.login;
        searchingUserList.appendChild(listItem);
      });
    }

    searchingUserWrapper.style.display = "block";
  }
}
