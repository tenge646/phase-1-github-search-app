document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    githubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = searchInput.value;

        // Clear previous search results
        userList.innerHTML = '';
        reposList.innerHTML = '';

        try {
            // Search for GitHub users by name
            const usersResponse = await fetch(`https://api.github.com/search/users?q=${username}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const usersData = await usersResponse.json();

            // Display user search results
            if (usersData.items && usersData.items.length > 0) {
                usersData.items.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.innerHTML = `
                        <img src="${user.avatar_url}" alt="${user.login}'s avatar">
                        <a href="${user.html_url}" target="_blank">${user.login}</a>
                    `;
                    userItem.addEventListener('click', () => {
                        // Fetch and display user repositories
                        displayUserRepositories(user.login);
                    });
                    userList.appendChild(userItem);
                });
            } else {
                userList.innerHTML = 'No users found.';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function displayUserRepositories(username) {
        try {
            // Fetch user repositories
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const reposData = await reposResponse.json();

            // Display user repositories
            if (reposData.length > 0) {
                reposList.innerHTML = '<h3>Repositories:</h3>';
                const repoList = document.createElement('ul');
                reposData.forEach(repo => {
                    const repoItem = document.createElement('li');
                    repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                    repoList.appendChild(repoItem);
                });
                reposList.appendChild(repoList);
            } else {
                reposList.innerHTML = 'No repositories found for this user.';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
