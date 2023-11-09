# Getting Started with Seamless Judging App

## Frontend Setup

#### Open terminal and set your path to frontend folder

#### Do the following steps

####

1.) `npm install`

####

2.) Create `.env` file inside **frontend** folder and place the below information

####

`PORT=2000`

####

`REACT_APP_LOCAL_DB_URL=http://localhost:3000`

####

`REACT_APP_HOST_URL=http://stark.cse.buffalo.edu:8000`

####

3.) `npm start`

####

You can now launch the application at [http://localhost:2000/]()

#### \*\*Please refer to backend readme file to create users/ to login.

## Code Structure

#### Go to src folder and you can find Components and Context

## Components

####

1.) Instructor -- contains instructor and events related components

####

2.) Judges -- contains judge related components along with services

####

3.) Clients -- contains client related components

####

4.) Students -- contains student related components along with services

####

5.) Common -- contains common services or images, error page, notification components

####

6.) Public -- contains public dashboard components

####

7.) Main -- contains overall structure that includes leftnav, appbar etc..

## Context

####

1.)Main Context -- contains Main context which is used as a global state manager.

We have used Ant-Design for building the user interface, you can refer to documentation detailed usage and understading.
