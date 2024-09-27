import { renderSearchingUsers } from "./render-searching-users.js";
import { renderUserContent } from "./render-user-content.js";

// TODO: add history, location, navigator - read info
// TODO: add infinity scroll
// TODO: add event delegation

window.addEventListener("popstate", navigateToUser);

const userQuery = new URLSearchParams(location.search);

if (userQuery.has("user")) {
  const param = userQuery.get("user");
  renderUserContent(param);
}

renderSearchingUsers(renderUserContent);

function navigateToUser(event) {
  if (!event.state) {
    history.go("/");
    return;
  }

  history.go(`?user=${event.state.user}`);

  renderUserContent(event.state.user);
}
