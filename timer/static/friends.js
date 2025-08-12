document.addEventListener('DOMContentLoaded', function () {
async function getfriends()
{
    let friends = await fetch('/view_invites');
    friends = await friends.json();
    friends.forEach(function(friend) {
        const li = document.createElement('li');
        li.innerText = friend.username;
        document.getElementById('friendslist').appendChild(li);

    }); // Close forEach callback
} 
getfriends();





})