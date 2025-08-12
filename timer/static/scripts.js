document.addEventListener('DOMContentLoaded', function() {
    let seconds = 0;
    let minutes = 10;
    let totalSeconds = (minutes * 60) + seconds; 
    let secondsInput = document.getElementById('seconds');
    let minutesInput = document.getElementById('minutes');
    let active = 0;
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

  secondsInput.addEventListener('input', function() {
    seconds = parseInt(this.value, 10);
    totalSeconds = (minutes * 60) + seconds;

    update(minutes, seconds);
  });
  
  minutesInput.addEventListener('input', function() {
    minutes = parseInt(this.value, 10);
    totalSeconds = (minutes * 60) + seconds;
    update(minutes, seconds);
    // document.getElementById('timer').innerText = `Timer: ${minutes}:${seconds}`;
  });

  let start = document.getElementById('start');
  console.log(start);
  start.addEventListener('click', function() {
    if (active == 0)
      {
        fetch(`/update_timer?minutes=${minutes}&seconds=${seconds}`);
      }
    if (active == 1)
          {
            active = 2;
            start.innerText = "Start Timer";
            clearInterval(time);
          }

    
    else
      {
        active = 1;
        start.innerText = "Stop Timer";
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
                  console.log(data);
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
