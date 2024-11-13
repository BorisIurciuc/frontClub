# ClubApp Frontend
ClubApp Frontend is a client-side application designed for managing activities, user registrations, and role-based 
permissions. It provides an interface for users, mentors, and admins to interact with the backend API, supporting varied
user roles with different levels of access to application features.

## Table of Contents

- [Overview] (#overview)
- [Features] (#Features)
- [Project Structure] (#Project Structure)
- [Main Components] (#Main Components)
- [Technologies Used] (#Technologies Used)
- [Getting Started] (#Getting Started)
- [Routes] (#Routes)
- [Roles and Permissions] (#Roles and Permissions)
- [Known Issues] (#Known Issues)

## Overview
The ClubApp frontend provides users access to various features, including activity browsing, user registration, and 
profile management, with administrative controls for managing users, activities, and content. This client-side 
application communicates with the ClubApp backend via RESTful API calls.

## Features
- **Authentication and Authorization** : Supports user login, registration, and password reset via email verification.
- **Activity Management** : Users can view, join, and manage their own activities.
- **News and Announcements** : Provides users with access to the latest news and announcements.
- **Reviews and Comments** : Users can leave reviews and comments, while admins can moderate this content.
- **Dashboard Interface** : Users can view their own activities, reviews, and news, while admins have full access to manage users and activities.

## Project Structure
The project follows a component-based React structure, making the code modular and easier to maintain:

- **components** : Shared components used throughout the app, such as buttons, forms, and modals.
- **pages** : Core pages of the application (e.g., Home, Activity List, Dashboard).
- **services** : Services to handle API requests (e.g., authService, activityService, newsService).
- **redux** : Application state and actions for managing data flow.
- **utils** : Utility functions for handling data, tokens, and access control.
- **assets** : Images, styles, and other static files.

## Main Components
- **HomePage** : The main landing page with an overview of all activities and news.
- **ActivityList** : Displays a list of all activities with filtering and detail viewing options.
- **ActivityDetail** : Shows detailed information about a selected activity, including reviews.
- **Auth (Login and Register)** : Login and registration pages with unique email validation and verification codes.
- **Dashboard (UserDashboard and AdminPanel)**: Personalized dashboard for users and an admin management panel.
- **NewsList and NewsDetail**: Components for viewing news items and details.
- **ReviewList and ReviewForm** : Review and comment management components.

## Technologies Used
- **React** : Core framework for building the user interface.
- **Redux** : State management for handling application data.
- **Redux Thunk** : Middleware for handling asynchronous operations.
- **Axios** : HTTP client for making API requests.
- **React Router** : Handles page routing.
- **Material-UI** : Component library for UI elements.
- **JWT (JSON Web Tokens)** : Authentication and authorization.
- **Formik and Yup** : Form handling and validation.

## Routes
Route	Description	Access

- `/` : Home page with activities and news	Public
- `/login` : Login page	Public
- `/register` :	Registration page	Public
- `/activities` : List of all activities	Public
- `/activities/:id` : Activity detail view	Public
- `/dashboard` : User dashboard	Authenticated Users
- `/adminPanel`	: Admin panel Admin Only

## Roles and Permissions
- |Role  |	Permissions|
- |Admin |	Full management access for users, activities, reviews, and news|
- |User  | Can view and participate in activities; can leave reviews and comments|

