document.addEventListener('DOMContentLoaded', function () {
async function getfriendsinvites()
{
    let friends = await fetch('/view_invites');
    friends = await friends.json();
    friends.forEach(function(friend) {
        const li = document.createElement('li');
        li.innerText = friend.username;
        li.className = "list-group-item d-flex justify-content-between align-items-center"
        const form = document.createElement('form');
        form.action = "/accept_friend";
        form.method = "POST";
        const input = document.createElement('input');
        input.type = 'hidden';
        input.value = `${friend.id}`;
        input.name = 'id';
        form.appendChild(input);
        const button = document.createElement('button');
        button.type ='submit';
        button.className = 'butoff'
        button.innerText = 'Accept';
        form.appendChild(button);
        li.appendChild(form);

        document.getElementById('inviteslist').appendChild(li);

    }); // Close forEach callback
} 
getfriendsinvites();


async function getfriends()
{
    let friends = await fetch('/view_friends');
    friends = await friends.json();
    friends.forEach(function(friend) {
        const li = document.createElement('li');
        li.innerText = friend.username;
        li.className = "list-group-item";
        document.getElementById('friendslist').appendChild(li);

    }); // Close forEach callback
} 
getfriends();

async function getleaderboard()
{
    let leaderboard = await fetch('/weekly_leaderboard');
    leaderboard = await leaderboard.json();
    leaderboard.forEach(function(friend) {
        const li = document.createElement('li');
        li.innerText = `${friend[0]} - ${friend[1]} minutes`;
        li.className = "list-group-item";
        document.getElementById('leaderboard').appendChild(li);


    });
}
getleaderboard();
});
