# Study Flow
# Name: Gabriel Whittaker
#### Video Demo:  <https://www.youtube.com/watch?v=N4O2EbwpUcM>
#### Description:
StudyFlow is a study timer which allow you track stats and comprare between friends. 
On entering the website you will so the main page index.html, allowing you to use the basic timer function without creating an account. 
The Navbar at the bottom will show options for the timer along with register and login, register.html, and login.html being the files.

This timer is powered by the javascript in timer.js. On this page there is a large timer along with time controls in the form of a dropdown as to not clutter the screen when in use. These allow to change the minutes and seconds, whilst the timer is paused or in use. The timer will also remember the current time if you leave the page and reload it paused upon re-entry. After the timer is complete it will reset to the intial entered value. This value is the last entered when the timer was paused. If logged this value will also be sent to be stored in the database along with the user ID and time completed, through the backend in app.py.

The stats page, stats.html contains a bootstraps carousel containg 3 graphs made by chart.js in stats.js. The charts are distrubtion of study time
showing % of total time studying each hour of the day, current monthly breakdown time studied each day, and uearly breakdown - time studied each month. At the bottom it shows total study time and teh average length of a study session. 

The next feature friends, on the page friends.html and friends.js, allows you invite friends by username. If that user exists, then this will send an invite to that user, which will sho win thier invites section with an accept button. If accepted the user will show on the friends list, along with the central elemnt of the page, the weekly leaderboard, which ranks all your friends and yourself by time studied in the last 7 days.

The final feature is goals, goLs.html and goals.js, competive progress trackers to incentivise studying. Here you can create a goal, to study x amount of time by a set deadline, with a title. Then from there you can choose from a dropdown of you friends who to add to the goal. If invited it will show up in goal invites, with a the time, title, date and everyone who has joined so far. Once accepted it will move into the goals section, where each person will have a progress bar where they can see how far they have progessed which will turn green when complete or red if uncomplete by the end. Two days after the end the goal will dissapear from the bar to avoid cluttering. 

styles.css controls all the colours, with a universal colour scheme of blue and off-white through-out.