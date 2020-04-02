# Security-systems
 It is a node application. Admins can be added and admins can view user's data (distance ,intrusion, temperature), add a new user ,add a new admin ...
 ## Technology-used:
  ###### front-end : html,css, semantic UI, Bootstrap, Javascript
  ###### back-end : nodejs, express, passport(authentication), mongoose
  ###### database : MongoDB, firebase
 ## Installation:
 #### Install Nodejs and MongoDB.
 #### Clone the repository
  ```bash
  git clone https://github.com/SparshJain2000/Security-systems.git
  ```
 #### Install node libraries
  ```bash
  npm install
  ```
 #### Declare environment variables
 ###### Create a file .env
  ```txt
  DB_URL = 'Your mongo url'
  SECRET = 'secret for Passport'
  ID = 'ID for registration'
  ```
 #### Start the server (run app.js file)
  ```bash
  node app.js
  ```

