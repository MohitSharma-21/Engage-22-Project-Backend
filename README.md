# Engage-22-Project-Backend

### Setting up the project

- Fork and clone this repo.
- Go the project folder in terminal and run `yarn` to install all dependencies.
- Run `yarn connectDB`to connect to the DB.
- Start the development server using `yarn dev`.


## API Description

### Auth System
For this API, I have used Token-based Authorization. All the requests made to the API (except the sign-in and sign-up endpoints) shall need an  *Authorization header*  with a valid token and the prefix  *Token*.

I have used jason web tokens(jwt) for tokens.

### End Points

**Auth**

-   `POST /api/auth/login/` 

	Takes the username as input, validates it and returns the **FaceDescriptors** of user, if the credentials are valid.  
  
	Request Body:
	```
	{
	  "username": "string",
	}
	```
	Response Body:
	```
	{
	  "token":  "string"
	}
	```
	Response Code: `200`
	
-   `POST /api/auth/register/`

	Register a user in Django by taking the name, email, username and password as input.
  
	Request Body:
	```
	{
	  "username": "string",
	  "password": "string"
	}
	```
	Response Body (Sample):
	```
	{
	  "token":  "string"
	}
	```
	
-   `POST /api/auth/profile/`

	Retrieve the id and username of the logged in user. Requires token in the Authorization header.
  
	Response Body:
	```
	{
	  "id":  1,
	  "username":  "string"
	}
	```


**Todo**

-   `GET /api/todo/`

	Get all the Todos of the logged in user. Requires token in the Authorization header.
  
	Response Body:
	```
	[
	  {
	    "id":  1,
	    "title":  "string"
	  },
	  {
	    "id":  2,
	    "title":  "string"
	  }
	]
	```
	Response Code: `200`

-   `POST /api/todo/create/` **(The Response Body of this endpoint is different from what we have created for Task 1)**

	Create a Todo entry for the logged in user. Requires token in the Authorization header.
  
	Request Body:
	```
	{
	  "title": "string"
	}
	```
	Response Body:
	```
	{
	  "id":  1,
	  "title":  "string"
	}
	```

-   `GET /todo/:id/`

	Get the Todo of the logged in user with given id. Requires token in the Authorization header.
  
	Response Body:
	```
	{
	  "id":  1,
	  "title":  "string"
	}
	```
	Response Code: `200`

-   `PUT /api/todo/:id/`

	Change the title of the Todo with given id, and get the new title as response. Requires token in the Authorization header.
  
	Request Body:
	```
	{
	  "title": "string"
	}
	```
	Response Body:
	```
	{
	  "id":  1,
	  "title":  "string"
	}
	```

-   `PATCH /api/todo/:id/`

	Change the title of the Todo with given id, and get the new title as response. Requires token in the Authorization header.
  
	Request Body:
	```
	{
	  "title": "string"
	}
	```
	Response Body:
	```
	{
	  "id":  1,
	  "title":  "string"
	}
	```

-   `DELETE /api/todo/:id/`

	Delete the Todo with given id. Requires token in the Authorization header.
  
