document.addEventListener('DOMContentLoaded', function () {
    async function displayGoal (goal, element) {
        let progess = await fetch(`/get_progress?taskID=${goal.id}`);
        progess = await progess.json();
        element.appendChild(document.createElement("h4")).innerText = goal.title;
        element.appendChild(document.createElement("h5")).innerText = `Study ${goal.length} minutes by ${new Date(goal.expire).toLocaleDateString()}`;
        progess.forEach(function (user) {
            element.appendChild(document.createElement("h6")).innerText = `${user[0]}`;
            const progressBar = document.createElement('div');
            progressBar.className = "progress";
            progressBar.role = "progressbar";
            const progress = document.createElement('div');
            progress.className = "progress-bar";
            progress.style.width = `${(user[1] / goal.length) * 100}%`;
            progressBar.appendChild(progress);
            element.appendChild(progressBar);
        });
    }
   
   
    async function showGoals() {
        let goals = await fetch('/view_goals');
        goals = await goals.json();
        goals.forEach(async function(goal) 
        {
            const li = document.createElement('li');
            displayGoal(goal, li);
            const form = document.createElement('form');
            form.action = "/invite_goal";
            form.method = "POST";
            const select = document.createElement('select');
            select.name = "id";
            
            let friends = await fetch('/view_friends');
            friends = await friends.json();
            friends.forEach(function(friend) {
                const option = document.createElement('option');
                option.value = `${friend.id}`;
                option.innerText = friend.username;
                select.appendChild(option);

            });
            const button = document.createElement('button');
            button.type = 'submit';
            button.innerText = 'Invite Friend';
            const input = document.createElement('input');
            input.type = 'hidden';
            input.value = `${goal.id}`;
            input.name = 'taskID';
            form.appendChild(input);
            form.appendChild(button);
            form.appendChild(select);
            li.appendChild(form);
            
            

            document.getElementById('goalslist').appendChild(li);
            
        });
    }

    async function showGoalsInvites() {
        let goals = await fetch('/view_goal_invites');
        goals = await goals.json();
        goals.forEach(async function(goal)
            {
            const li = document.createElement('li');
            displayGoal(goal, li);
            const form = document.createElement('form');
            form.action = "/accept_goal_invite";
            form.method = "POST";
            const input = document.createElement('input');
            input.type = 'hidden';
            input.value = `${goal.id}`;
            input.name = 'taskID';
            form.appendChild(input);
            const button = document.createElement('button');
            button.type = 'submit';
            button.innerText = 'Submit';
            form.appendChild(button);
            li.appendChild(form);

            document.getElementById('inviteslist').appendChild(li);

        });
    }
    showGoals();
    showGoalsInvites();



    


});
