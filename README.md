# Blog


## Repository
<https://github.com/philipjlin/FoodBlog>


## Description
Blog for creating and editing posts saved to a database.

Each entry has a title, description, and link to media, and search functionality for those components is a part of the site.


## Technologies
Front-end development in HTML/CSS, with templating done using EJS.

Express framework used for Node.js runtime environment.

MongoDB used as the database.


## High Level Components
    * Views to display, compose, and edit posts
    * Database with defined schemas to store objects
    * CSS style sheet 


## Class Overview
    CSS
        - styles.css
    
    Node Application
        - app.js


## Views
    Home
        - search

    About

    Compose

    Post
        - edit
        - delete

    Posts


## Database Sketch
    MongoDB Schema: Post

    Description: Will store posts with content

    Fields:
    ●	title: String
    ●	imageURL: String
    ●	text: String
