# convenientSakai

A full-stack project that I'm currently working on. This project currently only runs for the Dokuz Eylül University's online education system. You can "change" the domain and start using it for your desired education system that is based on Sakai

# FEATURES

--> Register and log in to the system </br>
--> Add your Sakai information to the system to view your announcements, assignments, and meetings </br>
--> Click on the join meeting button to quickly join to the current meeting that is still available </br>
--> See the meal of the day on the homepage (It's not integrated into the Sakai so it will still show the meal at Dokuz Eylül)</br>

# TODO

--> Add a reminder on meetings, homework</br>
--> Get a notification on a new announcement </br>
--> Filter and search through announcements and assignments</br>
--> Create an admin panel to easily change some parameters so that the software can be implemented to all Sakai systems</br>
--> Dark mode for my eyes

# HOW TO INSTALL

--> This script goes through your favorite sites that you can alter from your university's Sakai website by simply clicking the star icon next to the name of the class. 

## Step 1 : System Dependencies!

- Node.js have to be installed on your system if you didn't install node.js you can refer to this website Install node.js

## Step 2 : Setting up!

- Create a .env file in the backend folder. Using the .envreference file you can add necessary environment variables.
- Edit main.js to make backend work on an available port currently hardcoded to port 3000

## Step 2 : Installing Dependencies!

- Open two terminals, one of them needs to be on the "backend" folder and the other one needs to be on the "frontend" folder. You can use the vscode's integrated terminal to cd to them<br/>
- If you use npm you can run the "npm i %% sudo npm i nodemon -g" command on both of the terminals<br/>
- If you use yarn you can run the "yarn i %% sudo yarn i nodemon -g" command on both of the terminals<br/>

## Step 3 : Running the Program!!

- Open two terminals, one of them needs to be on the "backend" folder and the other one needs to be on the "frontend" folder. You can use the vscode's integrated terminal to cd to them
- If you use npm you can run the "npm i %% sudo npm i nodemon -g" command on both of the terminals
- If you use yarn you can run the "yarn i %% sudo yarn i nodemon -g" command on both of the terminals

# HOW TO USE

You can always use the GUI to interact with the system but if you want to develop and contribute there are some "key points" below.
- Proper system workflow requires you to register to the system, log in and add your Sakai credentials
- After all the info is registered to the database by using endpoints you have to send a request to the /user/getSakai to get the Sakai session token. Thus allowing the backend to store the token to the session.sakai by itself you do not have to do anything further
- The session token that the backend gets from the Sakai system may be expired within 15 minutes so it is a good idea to resend a request to /getSakai within that period
<h2>"Do not forget" that this software is still under development there are some SERIOUS SECURITY ISSUES!!!! for development reasons backend still responds with all the credentials about the user!!!!</h2>

<h2 AVAILABLE PROPERTIES</h2>

You can refer to my postman collection for what API endpoints available at this <a href="https://www.postman.com/sakaii/workspace/8161ca3b-6d45-4481-ba7a-ce8834812a84/overview">link</a>

<h3>Announcements</h3>

- Get all announcements (GET)<br/>

  --> Request : /user/announcements -- x-www-form-urlencoded or json<br/>
  --> Request body : <br/>
  --< Response : every title, id, status, create date, and announcement<br/>

- Get announcement details (GET)<br/>

  --> Request : /user/announcement/:id -- x-www-form-urlencoded or json<br/>
  --> Request body : <br/>
  --< Response : spesific title, id, status, create date, and announcement <br/>

<h3>Assignments</h3>

- Get all assignments (GET)<br/>

  --> Request : /user/assignment -- x-www-form-urlencoded or json<br/>
  --> Request body : <br/>
  --< Response : every title, id, status, due date, instructions <br/>

- Get assignment details (GET)<br/>

  --> Request : /user/assignments/:id -- x-www-form-urlencoded or json<br/>
  --> Request body : <br/>
  --< Response : spesific title, id, status, due date, instructions <br/>

<h3>Meetings</h3>

- Get all meetings (GET)<br/>

  --> Request : /user/meeting -- x-www-form-urlencoded or json<br/>
  --> Request body : <br/>
  --< Response : every id, status, start time, join url, tutor name, title <br/>

<h3>User</h3>

- Register to system (POST)<br/>

  --> Request : /user/register -- x-www-form-urlencoded or json<br/>
  --> Request body : name, email, password<br/>
  --< Response : status, name, email, id<br/>

- Login to system (POST)<br/>

  --> Request : /user/login -- x-www-form-urlencoded or json<br/>
  --> Request body : email, password<br/>
  --< Response : status, name, email<br/>

- Logout (GET)<br/>

  --< Response : status, message -- /user/logout<br/>

- Login to sakai (GET)<br/>

  --< Response : status, message that contains sakai cookie string<br/>

- Add sakai credentials (POST)<br/>

  --> Request body : sakaiEmail, sakaiPassword -- x-www-form-urlencoded or json -- /user/addSakai<br/>
  --< Response : status,message<br/>

<h3>Utils</h3>

- Get food list (GET)<br/>

  --> Request : /utils/foodList -- x-www-form-urlencoded or json <br/>
  --> Request body : <br/>
  --< Response : status, [{date,food,imgUrl}]<br/>

