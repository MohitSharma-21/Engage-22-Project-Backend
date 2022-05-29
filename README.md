# Engage-22-Project-Backend


## Introduction

In this project, I have used:

- Nodejs (Expressjs)
- Mongodb as a database
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) for face recognition
- jsonwebtoken(jwt) for user authentication
- Deployed the APIs at https://picture-and-todo-manager.herokuapp.com/
- **Frontend** part can be found [here](https://github.com/MohitSharma-21/Engage-22-Project-Frontend)


### Setting up the project

Follow the following steps to setup this project.

Or More detailed setup is [here](https://docs.google.com/document/d/1C9-GtIkLhgYKe-9f2ZyujzEh_CabTlwG0jOldP-kJaM/edit?usp=sharing)

**Note** - This project requires mongodb database and npm package manager to run on the local system.

### Run the server

- Clone this repo.
- Go the project folder in terminal.

Install the dependencies using
```
npm install
```

**Note** - Make sure in the **package.json** file that **@tensorflow/tfjs-node1.7.0** is installed. If not installed than insatll it using 
```
npm i @tensorflow/tfjs-node@1.7.0
```


**Note** - Make the **.env** file in the root directory and 

Add value for SECRET_KEY_JWT and add your mongodb database URL 

**make sure that the values are without opening and closing inverted commas**

```
SECRET_KEY_JWT = 
DB_URL = 

```

Then you can finally run the server using this command.
```
nodemon index.js
```

On successful execution and connecting to the database It will console log "Server connnected..." .

**Note** - If you want to connect to local system database, make sure that you have installed mongodb.

Run this command in different terminal for connecting to local system database
```
mongod
```


**Note** - If error comes like the below.

```
 return process.dlopen(module, path.toNamespacedPath(filename));
                 ^
 Error: Cannot find the specified module.
```

 **Copy or Move** node_modules@tensorflow\tfjs-node\deps\lib\tensorflow.dll **to** node_modules@tensorflow\tfjs-node\lib\napi-v6
 
**ps** napi-v6 could be v5 or else depending on version


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
  
