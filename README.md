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

-   `POST /api/auth/sign-in/` 

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
	  "labeledFaceDescriptors":"json"
	}
	```
	
	
-   `POST /api/auth/sign-up/`

	Registers a user by taking the name and images(Base64Images) as input.
  
	Request Body:
	```
	{
	  "username": "string",
	  "images_to_validate": "array of Base64 Images"
	}
	```
	Response Body (Sample):
	```
	{
	  "user": "string"
	  "token":  "string"
	}
	```
	
-   `GET /api/auth/profile/`

	Retrieves the id and username of the logged in user. Requires token in the Authorization header.
  
	Response Body:
	```
	{
	  "id":  1,
	  "username":  "string"
	}
	```

**Gallery**


-   `GET /api/gallery/`

	Gets all the Folders of Images of the logged in user. Requires token in the Authorization header.
  
	Response Body:
	```
	[
	  {
	    "id":  1,
	    "image_label":  "string"
	  },
	  {
	    "id":  2,
	    "image_label":  "string"
	  }
	]
	```

-   `GET /api/gallery/:id/`

	Gets all the Images of the folder with given id. Requires token in the Authorization header.
  
	Response Body:
	```
	{
	  "id":  1,
	  "images":  ["Base64Images"],
	  "image_label":  "string"
	}
	```
	

-   `POST /api/gallery/upload/` 

	Adds a picture in the folder classified by face-recognition model and returns the folder name in which image is added. Requires token in the Authorization header.
  
	Request Body:
	```
	{
	  "images": "Base64Image",
	  "image_label": "string", -> if required
	}
	```
	Response Body:
	```
	{
	  "image_label":  "string"
	}
	```
	

-   `PUT /api/gallery/:id/:index`

	Removes the Picture with given id and index. Requires token in the Authorization header.


**Todo**

-   `GET /api/todo/`

	Gets all the Todos of the logged in user. Requires token in the Authorization header.
  
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
	

-   `POST /api/todo/create/` 

	Creates a Todo entry for the logged in user. Requires token in the Authorization header.
  
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

	Gets the Todo of the logged in user with given id. Requires token in the Authorization header.
  
	Response Body:
	```
	{
	  "id":  1,
	  "title":  "string"
	}
	```

-   `PUT /api/todo/:id/`

	Changes the title of the Todo with given id, and gets the new title as response. Requires token in the Authorization header.
  
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

	Changes the title of the Todo with given id, and gets the new title as response. Requires token in the Authorization header.
  
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

	Deletes the Todo with given id. Requires token in the Authorization header.
  
