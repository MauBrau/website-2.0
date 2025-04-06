Three terminals for dev:

One open in `/react-app/`, two in `/node-runtime/`.

`npm run start` in `/react-app/` will open `http://localhost:3000/` and you can see live changes to frontend here.

`npm run webpack` in one of the `/node-runtime/` will listen to changes to the server and reflect them without needing to rebuild (`npm run build`) and re-start.

`npm run start` will open `http://localhost:8080/` which will display what's in the front end's `react-app/build` and use the express backend at the same time. There is a plugin in the webpack file that copies the contents of this folder to the build folder found here.