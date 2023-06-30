frontend files should be structured like the backend. When I look at the function, I don't want there to be any doubt about where the file resides. It should be possible to jump directly there with a short cut.

Duplicating the structure works unless you are using the file in multiple places.

scripts/
  all/
    pages/
      hello
  pages/
    project/
      renderProjects.js
      renderProject.js
      handleSave.js
      handleDelete.js
  views/
    pages


Alternative, everything in 1 directory:

pages/
  index/
    index.js
    index.scss
  project/
    project.js
    project.scss
    scripts/
      renderProjects.js
      renderProject.js
      handleSave.js
      handleDelete.js
