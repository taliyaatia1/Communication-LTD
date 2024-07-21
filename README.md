# Communication-LTD

Communication-LTD is a fictional communication company website developed to showcase my skills in implementing robust security measures and communication features similar to established companies like AT&T. The project highlights the prevention of SQL attacks, Cross-Site Scripting (XSS) vulnerabilities, and the use of self-signed SSL certification and HTTPS protocols to ensure a secure and private communication experience for users.

## Features

### Comprehensive Communication Services
Communication-LTD offers a comprehensive suite of communication services, designed to facilitate seamless interactions, connections, and information sharing among users.

### Advanced Security Implementation
The website is fortified with advanced security measures, including the prevention of SQL attacks and Cross-Site Scripting (XSS) vulnerabilities. These safeguards uphold the confidentiality and integrity of user data and interactions.

### Secure Communication Channels
Communication-LTD exemplifies the use of self-signed SSL certification and HTTPS protocols, guaranteeing encrypted and secure communication channels similar to those employed by reputable communication companies.



![image](https://github.com/user-attachments/assets/143ab5ed-abd9-48bd-b36c-2a26a53cbfa3)


![image](https://github.com/user-attachments/assets/2ef9674f-9cf7-4c59-99c5-3e5bc2b18290)


![image](https://github.com/user-attachments/assets/ca45fe4c-dbf1-4983-995f-084c59151f97)


## Setup Instructions

Follow these steps to set up and run the Communication-LTD project on your local machine.

git clone https://github.com/taliyaatia1/Communication-LTD
Navigate to the Project Directory:
  cd communication-ltd

Install the Necessary Dependencies
  npm install


##Set Up MySQL Databases and Tables
**Make sure you have MySQL installed and running on your system.**
Create two new databases: ltd-clients-db and ltd-users-db.

 ** Import the SQL schema files provided in the project:**
  1.For ltd-clients-db, import ltd-clients-db-schema.sql to set up the clients table.
  2.For ltd-users-db, import ltd-users-db-schema.sql to set up the users table.
  
Configure Database Connection
In the config folder, locate the db-config.js file.

Update the database configuration with your MySQL credentials, including host, user, password, and database names (ltd-clients-db and ltd-users-db).

**Start the Development Server**
npm start

Access the Website
Open your browser and navigate to: http://localhost

**Note:**

To view the contents of the users table, run:
Start MySQL and Use Databases
mysql -u root -p

USE ltd-clients-db;
USE ltd-users-db;
Then run:
SELECT * FROM users;





