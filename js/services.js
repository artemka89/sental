const API_URL = "https://api.github.com";

export async function getUser(username) {
  try {
    const response = await fetch(`${API_URL}/users/${username}`);

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getRepos(username) {
  try {
    const response = await fetch(`${API_URL}/users/${username}/repos`);

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserData(login) {
  const user = await getUser(login);
  if (!user) return null;

  const repos = await getRepos(login);

  return { user, repos };
}

export async function searchUser(username) {
  try {
    const response = await fetch(`${API_URL}/search/users?q=${username}`);

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
