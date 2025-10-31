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

  let start = document.getElementById('start');
  console.log(start);
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
                  start.innerText = "Start Timer";
                  async function fetchPrevious() 
                {
                  const prev = await(fetch(`/end_timer`));
                  const data = await prev.json();
               
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