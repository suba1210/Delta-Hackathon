### Mock Server:


Normal: 
- User auth, once logged in he can click create server to create a server and provide a name for it. - This is where all the requests will be routed from like /servername/api/<some route>.
- Create api routes and matching api schema. Basically route for Viewing all documents of a model, or single based on primary key 
- Example:-
/<servername>/api/<modelname>/all for getting all
/<servername>/api/<modelname>/:id for getting specific id
- Have a UI to add, create, delete routes and schema
- Generate random data and return according to schema
