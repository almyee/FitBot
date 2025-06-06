<h1>Getting Started with Create React App</h1>

<!-------------------------- RUNNING BACKEND INSTRUCTIONS --------------------------> 
<h2>Part 1: Running the Backend Directory</h2>
<h3> Available Scripts</h3>

<p>
Navigate to the <code>backend</code> directory in your terminal. Once you're there, install the required Node.js dependencies by running:
</p>

<pre><code>npm install</code></pre>

<p>
This command will read from the <code>package.json</code> file and install the following backend libraries:
</p>

<ul>
  <li><b>axios</b> – for making HTTP requests</li>
  
  <li><b>cors</b> – to enable Cross-Origin Resource Sharing</li>

  <li><b>dotenv</b> – to load environment variables from a <code>.env</code> file</li>

  <li><b>express</b> – a web framework used to create the API</li>

  <li><b>mongoose</b> – an ODM (Object Data Modeling) library for MongoDB</li>
</ul>

<p>
    <b>Note:</b> These libraries are required for the backend server to function correctly.
</p>

<p>
After the installation is complete, you can start the backend server by running:
</p>

<pre><code>node server.js</code></pre>

<p>
This command launches the backend server and establishes a connection to your MongoDB Atlas database using the URI stored in your <code>.env</code> file. 
The backend handles API requests from the frontend, interacts with the database, and sends responses back to the client.
</p>

<p>
Once the server is running, you’ll see logs in the terminal reflecting backend activity (such as connection status, API requests, or errors).
</p>

<!-------------------------- RUNNING FRONTEND INSTRUCTIONS --------------------------> 
<h2>Part 2: Running the Frontend Directory</h2>
<h3> Available Scripts</h3>

<p>
Navigate to the <code>frontend</code> directory in your terminal. Once you're there, install all necessary frontend dependencies by running:
</p>

<pre><code>npm install</code></pre>

<p>
This command reads from the <code>package.json</code> file and installs all the required packages and libraries for the frontend React application to work correctly.
</p>

<p>
After the installation is complete, start the development server by running:
</p>

<pre><code>npm run start</code></pre>

<p>
This will launch the app in development mode. By default, it opens in your browser at:
</p>

<p>
<a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
</p>

<p>
The page will automatically reload whenever you make edits to the source code.<br />
Any syntax or linting errors will appear in the browser console or terminal.
</p>


<pre><code>npm test</code></pre>

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

<pre><code>npm run build</code></pre>

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

<pre><code>npm run eject</code></pre>

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
