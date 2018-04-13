Base project for website using typescript. All typescript files need to being imported into app.ts in the source directory. 

## Only make changes in the src directory.  All files will be generated and moved to the dist directory.  

Inline feature will only inline files if the inline flag is added to each css and js link in the html document. For example:     `<link rel="stylesheet" type="text/css" href="css/app.css" inline >`


## Steps
* Run `npm install` from the root directory of the project.
* Run `mkdir dist/img` in project root.
* Run `mkdir src/img` in project root.
* Run `gulp` to start task runner which will also start up a local server. 

## Project structure
root
* gruntfile.js
* package.json
* tsconfig.json
* src/
  * html/
  * scss/
  * img/
  * typescript/
* dist/
  * index.html
  * css/
  * js/
  * img/

     
