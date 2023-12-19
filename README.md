## Getting Started

First, install the package:

```bash
npm install next-gen-code-generator -g
# or
yarn install next-gen-code-generator -g
```


To use the next gen run:
```bash
next-gen ui
# or
next-gen generate
```
Note: to run ```next-gen generate``` you have to have the next-gen.json file where you are running the command.

#### Setup

1. After running ```next-gen ui``` the next-gen wizard should be running on http://localhost:8087

2. Add the project name. This will be the project name of the generated Next JS project.

3. Add the intended project path of the Next JS project.

4. Add the MYSQL DB Host URL.

5. Add the MYSQL DB Name.

6. Add the MYSQL DB username.

7. Add the MYSQL DB password

8. Add the model name that should not include spaces, non-alphanumeric characters (except underscores), starts with a number, or includes SQL keywords.

9. Add the allowed CRUD operations for your model. Check all boxes to allow all CRUD actions

10. Repeat the process adding all the models for your project. Ensure you use plural nouns to name your models.

11. Setup fields for all your models. After selecting a model for your field, add the field type, if the field will be required when creating the record, and the main identifier(A field that will act as the main identifier for a record eg. name, A model can have only one identifier). Add if the field should be visible on the UI table display.

12. Setup the relationships. Next-gen supports 1:n relationships for now. For each model, Add the parent models.(All the models that the current model belongs to).

13. Confirm the models, fields and relationships and generate Next JS project. 

14. The project should be running on http://localhost:3000/


#### REST APIs
Next-Gen will automatically generate REST endpoints for:

1. POST - create record for the model

2. PUT - update record for the model

3. GET - fetch record(s) for the model(```GET model/?id=2``` to fetch specific record using the record id and ```GET model/``` to fetch all the records for the model. By default the GET method will return the main identifiers for the parent models)

4. DELETE - delete the record for the model

    