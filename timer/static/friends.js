document.addEventListener('DOMContentLoaded', function () {
async function getfriendsinvites()
{
    let friends = await fetch('/view_invites');
    friends = await friends.json();
    friends.forEach(function(friend) {
        const li = document.createElement('li');
        li.innerText = friend.username;
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
        button.innerText = 'Submit';
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
        document.getElementById('friendslist').appendChild(li);

    }); // Close forEach callback
} 
getfriends();




})