let seconds = 0;
let minutes = 10;
document.addEventListener('DOMContentLoaded', function() {
    
    let totalSeconds = (minutes * 60) + seconds; 
    let secondsInput = document.getElementById('seconds');
    let minutesInput = document.getElementById('minutes');
    let active = 2;
    let time = null;

  
  
  function update(minutes, seconds) {
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    
    document.getElementById('timer').innerText = `${minutes}:${seconds}`;
    minutesInput.value = minutes;
    secondsInput.value = seconds;
  }
  update(minutes, seconds);
  async function get_time() 
  {
    const prev = await (fetch(`/get_current_timer`));
    const data = await prev.json();
    if (data.status == 0)
    {
      active=0;
        return 0;
    }
    else{
    minutes = parseInt(data.minutes);
    seconds = parseInt(data.seconds);
    totalSeconds = (minutes * 60) + seconds;
    active = 2;
    update(minutes, seconds);
    return 0;
    }
  }
  get_time();
  secondsInput.addEventListener('input', function() {
    seconds = parseInt(this.value, 10);
    totalSeconds = (minutes * 60) + seconds;
    active = 0;
    update(minutes, seconds);
  });
  
  minutesInput.addEventListener('input', function() {
    minutes = parseInt(this.value, 10);
    totalSeconds = (minutes * 60) + seconds;
    active = 0;
    update(minutes, seconds);
    // document.getElementById('timer').innerText = `Timer: ${minutes}:${seconds}`;
  });


  async function getGoals()
  {
    let goals = await fetch('/view_goals');
    goals = await goals.json();
    let activeGoals = document.getElementById('activeGoals')
    goals.forEach(async function(goal)
    {
      
      const goalElement = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = goal.id;
      //checkbox.checked = 'bool'
      const label = document.createElement('label');
      label.for = goal.id;
      label.innerText = goal.title;
      goalElement.appendChild(checkbox);
      goalElement.appendChild(label);
      activeGoals.appendChild(goalElement);

    })
  }
  async function sendGoals()
  {
    let activeGoals = document.getElementById('activeGoals')
    const goals = []
    Array.from(activeGoals.children).forEach(async function (goal) 
    {
      if (goal.children[0].checked)
        {
          goals.push(goal.children[0].id);
        }
        
    }
    
  );
    fetch("/goalProgress",{
      method: 'Post', 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals)
    }
    );
  }
  getGoals()

  let start = document.getElementById('start');
  //console.log(start);
  start.addEventListener('click', function() {
    if (active == 0)
      {
        fetch(`/update_timer?minutes=${minutes}&seconds=${seconds}`);
        //start for for fisrt time
      }
    if (active == 1)
      //pause
          {
            active = 2;
              start.innerHTML = '<img src="/static/play.png" alt="Start" width="30" height="30">';
            clearInterval(time);
          }

    
    else
      {
        active = 1;
        start.innerHTML = '<img src="/static/pause.png" alt="Stop" width="30" height="30">';
        time = setInterval(function(){
            totalSeconds--;
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
 
            update(minutes, seconds);
            if ( totalSeconds <= 0) 
              { 
                  clearInterval(time);
                  start.innerHTML = '<img src="/static/play.png" alt="Start" width="30" height="30">';
                  async function fetchPrevious() 
                {
                  
                  const prev = await(fetch(`/end_timer`));
                  const data = await prev.json();
                  sendGoals();
                  minutes = parseInt(data.minutes);
                  seconds = parseInt(data.seconds);
                  totalSeconds = (minutes * 60) + seconds;
                  active = 0;
                  update(minutes, seconds);
                  return 0;
                }
                fetchPrevious();
                 
                  
                } 

        }, 1000)}

});


});

window.addEventListener('pagehide', function () {
  
 
  fetch(`/update_current_timer?minutes=${parseInt(minutes)}&seconds=${parseInt(seconds) }`);
  


});