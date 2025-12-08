document.addEventListener('DOMContentLoaded', function () {
    async function displayGoal (goal, element, show=true) {
        console.log(goal.id);
        let progess = await fetch(`/get_progress?taskID=${goal.id}`);
        progess = await progess.json();
        const title  = document.createElement("h5")
        title.innerText = goal.title;
        title.className = "card-title";
        element.appendChild(title);
        const expire = document.createElement("h6")
        expire.innerText = `Study ${goal.length} minutes by ${new Date(goal.expire).toLocaleDateString()}`;
        expire.className = "card-subtitle mb-2 text-body-secondary";
        element.appendChild(expire);
        if (show){
        progess.forEach(function (user) {
            let customText = "";
            const progressBar = document.createElement('div');
            progressBar.className = "progress";
            progressBar.role = "progressbar";
            const progress = document.createElement('div');
            progress.className = "progress-bar";
            time = (user[1] / goal.length) * 100;
            progress.style.width = `${time}%`;
            if (time > 100) {
                progress.className = "progress-bar bg-success";
                progress.style.width = "100%";
                const name = document.createElement("h6")
                name.innerText = `${user[0]} completed the goal! :)`;
                name.className = "card-text";
                customText = name
                
            }
            if (new Date(goal.expire).getTime() < Date.now() ) {
              
                if (time < 100){
                    progress.className = "progress-bar bg-danger";
                    const name = document.createElement("h6")
                    name.innerText = `${user[0]} failed :(`;
                    name.className = "card-text";
                    customText = name
                    
                }
                
            }
            else
                {
            const name = document.createElement("h6")
            name.innerText = `${user[0]}`;
            name.className = "card-text";
            element.appendChild(name);
        }
            progressBar.appendChild(progress);
            element.appendChild(progressBar);
            if (customText != "")
                {element.appendChild(customText)}
        });}
        else
            {
                const users  = element.appendChild(document.createElement("h6"));
                users.innerText = "Join  ";
                let x = 0;
                progess.forEach(function (user)
                {
                    if (x > 0)
                        {
                            users.innerText += ",";
                        }
                    users.innerText += ` ${user[0]}`;
                    x += 1;
                });
            }
    }
   
   
    async function showGoals() {
        let goals = await fetch('/view_goals');
        goals = await goals.json();
        goals.forEach(async function(goal) 
        {
            const card = document.createElement('div');
            card.className = "card flex-shrink-0";
            card.style = "width: 18rem;";

            const cardbody = document.createElement('div');
            cardbody.className = "card-body";
            displayGoal(goal, cardbody);
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
            button.className = 'invitebtn'
            const input = document.createElement('input');
            input.type = 'hidden';
            input.value = `${goal.id}`;
            input.name = 'taskID';
            form.appendChild(input);
            form.appendChild(button);
            form.appendChild(select);
            cardbody.appendChild(form);
            card.appendChild(cardbody);
            

            document.getElementById('goalslist').appendChild(card);
            
        });
    }

    async function showGoalsInvites() {
        let goals = await fetch('/view_goal_invites');
        goals = await goals.json();
        goals.forEach(async function(goal)
            {
            const card = document.createElement('div');
            card.className = "card flex-shrink-0";
            card.style = "width: 18rem;";

            const cardbody = document.createElement('div');
            cardbody.className = "card-body";
            displayGoal(goal, cardbody, false);
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
            button.className = 'butoff'
            button.innerText = 'Accept Invite';
            form.appendChild(button);
            cardbody.appendChild(form);
            card.appendChild(cardbody);
            
            
            document.getElementById('inviteslist').appendChild(card);

        });
    }
    showGoals();
    showGoalsInvites();



    


});
