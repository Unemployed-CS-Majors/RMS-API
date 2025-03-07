<div align="left" style="position: relative;">
<h1>RMS-API</h1>
<p align="left">
	<em>RMS-API: Powering Your Data, Streamlining Your Code</em>
</p>
<p align="left">
	<img src="https://img.shields.io/github/license/Unemployed-CS-Majors/RMS-API?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Unemployed-CS-Majors/RMS-API?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Unemployed-CS-Majors/RMS-API?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Unemployed-CS-Majors/RMS-API?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="left"><!-- default option, no dependency badges. -->
</p>
<p align="left">
	<!-- default option, no dependency badges. -->
</p>
</div>
<br clear="right">

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

##  Overview

The RMS-API project is a robust solution for managing real-time data interactions within web applications. It leverages Firebase for seamless backend integration and Firestore for optimized data querying. Key features include consistent environment setups across development stages and detailed API documentation. This API is ideal for developers needing efficient, scalable solutions for dynamic web environments.

---

##  Features

|      | Feature         | Summary       |
| :--- | :---:           | :---          |
| ⚙️  | **Architecture**  | <ul><li>Utilizes Firebase for backend services including Firestore for database management.</li><li>Structured around JavaScript and JSON for configuration and scripting.</li><li>API-centric design with Swagger for API documentation and testing.</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Codebase primarily in JavaScript, ensuring consistency and ease of use for developers familiar with the language.</li><li>Use of JSON and YAML for configuration promotes clean and maintainable code structure.</li><li>Includes shell scripts for deployment, indicating automation and reproducibility in builds.</li></ul> |
| 📄 | **Documentation** | <ul><li>API documented using Swagger, which is integrated via `swagger-jsdoc` and `swagger-ui-express`.</li><li>Documentation includes detailed setup and usage commands, enhancing developer onboarding.</li><li>Configuration files like `firebase.json` and `firestore.indexes.json` are well-documented within the codebase, providing clarity on infrastructure setup.</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Integrates with Firebase services, leveraging Firestore, Firebase Functions, and Firebase Auth for comprehensive backend management.</li><li>Swagger UI for API testing and interaction.</li><li>GitHub Actions for CI/CD, automating testing and deployment processes.</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Codebase structured in a modular fashion with separate files for different configurations and services.</li><li>API endpoints likely modularized through JavaScript functions.</li><li>Use of npm packages to manage dependencies modularly.</li></ul> |
| 🧪 | **Testing**       | <ul><li>Includes npm scripts for running tests, indicating a structured approach to testing.</li><li>Use of Firebase local emulator settings for enhanced testing efficiency.</li><li>Swagger UI can be used to perform live testing of API endpoints.</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Firestore indexes and rules optimized for query performance.</li><li>JavaScript and Firebase optimized for efficient data handling and response times.</li><li>Use of npm and package-lock.json ensures consistent dependency management for performance stability.</li></ul> |
| 🛡️ | **Security**      | <ul><li>Firestore rules define access controls and data validation, enhancing security.</li><li>Use of HTTPS in Firebase and secure handling of API documentation and testing with Swagger.</li><li>Security practices likely integrated within GitHub Actions workflows for CI/CD.</li></ul> |
| 📦 | **Dependencies**  | <ul><li>Managed through npm, with explicit lock files to ensure consistent environments.</li><li>Dependencies include `swagger-jsdoc`, `swagger-ui-express`, and Firebase SDKs.</li><li>Structured use of JSON schema tools for robust data validation.</li></ul> |

---

##  Project Structure

```sh
└── RMS-API/
    ├── .github
    │   ├── ISSUE_TEMPLATE
    │   └── workflows
    ├── CODE_OF_CONDUCT.md
    ├── LICENSE
    ├── README.md
    ├── firebase.json
    ├── firestore.indexes.json
    ├── firestore.rules
    ├── functions
    │   ├── .gitignore
    │   ├── app
    │   ├── app.js
    │   ├── generate-swagger.js
    │   ├── index.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── scripts
    │   └── swagger.yaml
    ├── package-lock.json
    └── package.json
```


###  Project Index
<details open>
	<summary><b><code>RMS-API/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/firebase.json'>firebase.json</a></b></td>
				<td>- Configures Firebase services including Firestore rules and indexes, and function deployment settings for the project<br>- It specifies local emulator settings for development, including ports for authentication, functions, and Firestore, enhancing testing efficiency<br>- The configuration ensures a streamlined environment setup and operational consistency across development and production environments, centralizing project management within Firebase.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/firestore.indexes.json'>firestore.indexes.json</a></b></td>
				<td>- Manages Firestore database configurations by defining indexes and field-specific rules within the codebase<br>- The `firestore.indexes.json` serves as a blueprint for database structure optimization and query efficiency, ensuring that data retrieval operations are streamlined and adhere to specified constraints and enhancements<br>- This setup is crucial for maintaining performance and scalability of the database interactions.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td>- The `package-lock.json` file in the RMS-API project serves as a critical component for managing the project's dependencies, ensuring consistent installations and compatibility across different development environments<br>- This file specifically locks down the versions of dependencies such as `swagger-jsdoc` and `swagger-ui-express`, which are essential for documenting the API endpoints within the RMS-API<br>- Additionally, it includes dependencies like `@apidevtools/json-schema-ref-parser` to handle JSON schema parsing, crucial for validating and working with JSON schemas in the API.

In the broader architecture of the RMS-API, this file ensures that all developers working on the project use the same versions of packages, thereby avoiding discrepancies that can arise from version mismatches<br>- This is particularly important in maintaining the stability and reliability of the API across different setups and when deploying to production environments<br>- The dependencies listed are integral for API documentation and schema validation, which are fundamental aspects of the API's functionality and its interaction with other services or clients.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/firestore.rules'>firestore.rules</a></b></td>
				<td>- Firestore.rules establishes temporary, unrestricted access permissions for all operations within the Firestore database<br>- It is designed to facilitate initial development phases by allowing broad data manipulation until a specified expiration date<br>- Post-expiration, it mandates the implementation of more secure, tailored access rules to protect the database from unauthorized access.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/package.json'>package.json</a></b></td>
				<td>- Manages the integration of Swagger documentation tools within the project by specifying dependencies crucial for creating and displaying API documentation<br>- The inclusion of swagger-jsdoc and swagger-ui-express facilitates the automatic generation and elegant presentation of API endpoints, enhancing the development and consumption of the project's RESTful services.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- .github Submodule -->
		<summary><b>.github</b></summary>
		<blockquote>
			<details>
				<summary><b>workflows</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/.github/workflows/api-documentation.yaml'>api-documentation.yaml</a></b></td>
						<td>- Check & deploy API documentation automates the generation and deployment of API documentation upon code changes<br>- It triggers on pushes and pull requests to main and develop branches, generating Swagger YAML files and either deploying them or checking API differences using Bump.sh.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/.github/workflows/deploy-firebase-functions.yml'>deploy-firebase-functions.yml</a></b></td>
						<td>- Deploys Firebase Functions automatically upon code pushes to the main or develop branches<br>- The GitHub Actions workflow includes steps for setting up the environment, installing necessary tools and dependencies, and deploying functions using Firebase CLI, ensuring a streamlined update process for server-side logic in response to repository changes.</td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- functions Submodule -->
		<summary><b>functions</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app.js'>app.js</a></b></td>
				<td>- App.js serves as the central hub for routing in the application, integrating various modules for handling specific domain-related routes such as authentication, tables, reservations, and user management<br>- It configures middleware for CORS, metrics, and error handling, ensuring efficient route management and initial setup for application counters.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/package-lock.json'>package-lock.json</a></b></td>
				<td>- The `package-lock.json` file located in the `functions` directory plays a crucial role in managing and ensuring the consistency of the dependencies used within this specific part of the project<br>- This file is automatically generated and updated when dependencies are installed or modified through npm (Node Package Manager)<br>- It serves to lock the versions of the dependencies listed, ensuring that every installation or deployment of the project uses the exact same versions, thereby avoiding discrepancies and potential bugs caused by version mismatches.

In the context of the entire codebase, this file ensures that the server-side functions, likely used for handling backend processes such as API requests, database interactions, and third-party service integrations, remain stable and consistent across different development and production environments<br>- The dependencies listed, such as `express` for server operations, `axios` for HTTP requests, and `firebase` for database interactions, indicate that this part of the project is focused on backend services which are crucial for the application's functionality.

This file is essential for maintaining the integrity and reliability of the application's backend logic, particularly in a collaborative development environment or when deploying to different servers or platforms.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/index.js'>index.js</a></b></td>
				<td>- Functions/index.js serves as the entry point for handling HTTP requests within the project, routing them through an Express application<br>- It utilizes Firebase Functions to manage these requests, ensuring that the application's web services are scalable and efficiently integrated with cloud capabilities, thereby supporting the broader architecture's functionality and responsiveness.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/package.json'>package.json</a></b></td>
				<td>- Manages the deployment and local emulation of cloud-based functions for a Firebase project, facilitating serverless backend operations<br>- It includes scripts for serving, deploying, and logging functions, and specifies dependencies necessary for email services, API interactions, authentication, and monitoring<br>- The setup targets Node.js environment version 20, ensuring compatibility and performance optimization.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/generate-swagger.js'>generate-swagger.js</a></b></td>
				<td>- Generates a Swagger YAML documentation file for the Restaurant Management System API, detailing endpoints, authentication methods, and other service definitions<br>- This documentation supports API clarity and integration efforts across the development team, ensuring consistent and accessible API references.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/swagger.yaml'>swagger.yaml</a></b></td>
				<td>- Defines and documents the API endpoints for user authentication within the system, including user registration, login, and token refresh operations<br>- It specifies the required data structures, expected responses, and error handling for these processes, facilitating clear communication between the server and client applications.</td>
			</tr>
			</table>
			<details>
				<summary><b>scripts</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/scripts/setup-dev.sh'>setup-dev.sh</a></b></td>
						<td>- Facilitates the setup of a development environment for a restaurant management system by registering a user, updating user privileges, logging in the user, and configuring restaurant tables and opening hours through various API endpoints<br>- It automates initial data seeding and configuration tasks to streamline developer onboarding and testing.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/scripts/setup-prod.sh'>setup-prod.sh</a></b></td>
						<td>- Facilitates the setup of a production environment for a restaurant management system by registering user credentials, logging in to retrieve authentication tokens, and using these tokens to add restaurant tables and opening hours via API calls<br>- This script ensures essential components are initialized for system functionality.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/scripts/start_dev.sh'>start_dev.sh</a></b></td>
						<td>- Initiates the development environment setup by navigating to the functions directory and executing the setup-dev.sh script<br>- This script is crucial for preparing the necessary configurations and dependencies specific to development tasks, ensuring that all components within the project's architecture are correctly aligned for development activities.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<details>
						<summary><b>middlewares</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/middlewares/privilages.middleware.js'>privilages.middleware.js</a></b></td>
								<td>- Provides middleware functions to enforce user access control within the application<br>- It includes mechanisms to verify if a user holds specific privileges, such as being an owner or an employee, using Firebase authentication and user privilege data stored in Firestore<br>- These checks are essential for securing routes that require elevated permissions.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/middlewares/auth.middleware.js'>auth.middleware.js</a></b></td>
								<td>- Auth.middleware.js serves as a security layer within the application, responsible for verifying Firebase ID tokens<br>- It ensures that incoming requests to the server are authenticated by checking and decoding tokens provided in the request headers, thereby granting or denying access based on the token's validity.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>config</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/config/auth.config.js'>auth.config.js</a></b></td>
								<td>- Manages authentication URLs for Firebase services, adapting to different environments by checking if the Firebase emulator is active<br>- It configures endpoints for user sign-in and token refresh processes, ensuring seamless authentication operations whether in development or production settings<br>- This setup supports both standard and custom token-based authentications.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/config/prometheus.config.js'>prometheus.config.js</a></b></td>
								<td>- Prometheus.config.js configures middleware for capturing and exposing metrics from the RMS-API, a REST API project<br>- It enhances monitoring by tracking HTTP method, path, status code, and system health<br>- Custom labels identify the project within the metrics<br>- This setup aids in performance analysis and operational oversight by integrating with Prometheus, a monitoring tool.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/config/firebase.config.js'>firebase.config.js</a></b></td>
								<td>- Initializes the Firebase Admin SDK to enable server-side interactions with Firebase services<br>- It sets up the application instance and Firestore database access, which are crucial for backend operations such as authentication, data storage, and retrieval<br>- These configurations are essential for integrating Firebase functionalities across the entire application architecture.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>controllers</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/reservation.controller.js'>reservation.controller.js</a></b></td>
								<td>- ReservationController manages reservation operations within a restaurant reservation system, handling tasks such as creating, canceling, confirming, completing, rescheduling, and retrieving reservations<br>- It integrates user and table validation, manages reservation overlaps, and communicates with users through email notifications regarding reservation statuses.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/window.controller.js'>window.controller.js</a></b></td>
								<td>- WindowController manages interactions with window data within the application, facilitating operations such as retrieving, creating, updating, and deleting windows<br>- It utilizes services and validators to ensure data integrity and handle requests, providing structured responses based on the outcome of these operations.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/door.controller.js'>door.controller.js</a></b></td>
								<td>- DoorController serves as the interface for managing door entities within the application, handling operations such as retrieving, creating, updating, and deleting doors<br>- It utilizes service layer interactions and validation mechanisms to ensure data integrity and provide appropriate responses to client requests.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/auth.controller.js'>auth.controller.js</a></b></td>
								<td>- AuthController manages user authentication and authorization processes within the application<br>- It handles user operations such as registration, login, token refresh, and account management, including creating roles like employees and owners, deleting accounts, and integrating Google sign-in<br>- This controller ensures secure user access and identity management across the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/user.controller.js'>user.controller.js</a></b></td>
								<td>- UserController serves as a central component for user management within the application, facilitating operations such as retrieving individual or groups of users, updating user privileges, and handling user verification<br>- It interacts with the UserService to perform these functions and utilizes structured responses for consistency in communication with clients.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/table.controller.js'>table.controller.js</a></b></td>
								<td>- TableController manages interactions with table data, facilitating operations such as retrieving, creating, updating, deleting, and toggling the activation status of tables<br>- It handles request validation, interacts with the TableService for data manipulation, and formats responses to ensure consistent communication with clients.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/floorPlan.controller.js'>floorPlan.controller.js</a></b></td>
								<td>- FloorPlanController serves as a central component in the application's architecture, orchestrating the aggregation of data related to floor plans<br>- It interacts with services dedicated to managing doors, walls, windows, and tables, compiling these elements into a comprehensive floor plan structure, which is then delivered to the client upon request.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/wall.controller.js'>wall.controller.js</a></b></td>
								<td>- WallController serves as the interface for managing wall entities within the application, facilitating operations such as retrieving, creating, updating, and deleting walls<br>- It interacts with the WallService to execute business logic and utilizes utility functions and validators to handle responses and data integrity.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/controllers/openingHours.controller.js'>openingHours.controller.js</a></b></td>
								<td>- OpeningHoursController manages interactions with opening hours data, facilitating operations such as retrieval, creation, updating, and deletion of opening hours records<br>- It utilizes services and models to handle business logic and data validation, ensuring responses are correctly formatted and errors are handled efficiently.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>validators</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/reservation.validators.js'>reservation.validators.js</a></b></td>
								<td>- Validates reservation-related data within the application, ensuring compliance with required formats and constraints<br>- Functions check the validity of date-time strings, reservation request completeness, and the integrity of input types such as integers for table IDs and number of people, enhancing data reliability for reservation management.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/openingHours.validators.js'>openingHours.validators.js</a></b></td>
								<td>- Validates the opening hours input from a request by ensuring all required fields are present and correctly formatted<br>- It checks that the day, start time, and end time are specified, and verifies that the start time is earlier than the end time<br>- Errors are returned if any validations fail, facilitating reliable scheduling data management within the application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/window.validators.js'>window.validators.js</a></b></td>
								<td>- Validates parameters for creating and updating window and wall entities within an application<br>- It ensures all required fields are present and correctly formatted as integers, including coordinates and dimensions<br>- Errors are returned for any validation failures, facilitating robust data handling and integrity in the system's architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/wall.validators.js'>wall.validators.js</a></b></td>
								<td>- Validates user input for creating and updating wall coordinates within the application<br>- The functions ensure all required fields are present and that each coordinate value is an integer<br>- This validation process helps maintain data integrity and prevents errors during wall creation and modification operations in the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/auth.validators.js'>auth.validators.js</a></b></td>
								<td>- Validates user input for registration, login, and refresh token requests within the authentication process<br>- It ensures all necessary fields are provided and checks email format validity<br>- These validations are crucial for maintaining data integrity and security across user interactions in the system, facilitating reliable user management and authentication workflows.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/door.validators.js'>door.validators.js</a></b></td>
								<td>- Validates the creation and updating of door entities within the application by ensuring all required fields (x, y, width, height, rotation) are present and correctly formatted as integers<br>- These functions serve as a crucial checkpoint in the data integrity process, preventing errors in door data management.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/validators/table.validators.js'>table.validators.js</a></b></td>
								<td>- Validates parameters for creating a table within an application, ensuring all required fields such as seat count, window proximity, and spatial coordinates are correctly formatted and present<br>- Errors are returned for any invalid or missing data, facilitating reliable data entry and integrity in table management operations.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>models</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/reservation.model.js'>reservation.model.js</a></b></td>
								<td>- Defines and manages reservation data within the application, encapsulating the creation and conversion of reservation instances to and from Firestore-compatible formats<br>- It includes a class for reservation objects with methods for Firestore integration and an enumeration of possible reservation statuses, facilitating consistent state management across the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/user.model.js'>user.model.js</a></b></td>
								<td>- Defines and manages the User model, encapsulating attributes such as unique identifier, name, email, phone number, and privileges<br>- It includes methods to serialize and deserialize User instances for compatibility with Firestore, ensuring smooth data transactions and state management within the application's backend architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/openingHours.model.js'>openingHours.model.js</a></b></td>
								<td>- Defines and manages the structure for storing opening hours in a system, encapsulating days of the week and specific start and end times<br>- It includes functionality to serialize and deserialize these details to and from a Firestore database format, ensuring data integrity and ease of data manipulation within the application's backend architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/wall.model.js'>wall.model.js</a></b></td>
								<td>- Wall.model.js defines a Wall class essential for representing and managing wall entities within the application's model layer<br>- It facilitates the conversion of wall data between the application's internal representation and Firestore database format, ensuring seamless data persistence and retrieval operations integral to the system's architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/door.model.js'>door.model.js</a></b></td>
								<td>- Door model in `functions/app/models/door.model.js` serves as a data structure for door entities, encapsulating properties like position, size, and orientation<br>- It includes methods for serializing to and from Firestore, ensuring data integrity and facilitating easy storage and retrieval within the application's database architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/table.model.js'>table.model.js</a></b></td>
								<td>- Defines the Table class, encapsulating properties such as ID, seat count, window proximity, activity status, and spatial coordinates<br>- It includes methods to convert table instances for compatibility with Firestore and to instantiate from Firestore data, facilitating data management and integration within the application's model layer.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/models/window.model.js'>window.model.js</a></b></td>
								<td>- Window.model.js defines a Window class essential for managing window entities within the application<br>- It facilitates the creation, manipulation, and storage of window attributes such as position, size, and rotation<br>- The class also includes methods for serialization and deserialization to interface seamlessly with Firestore, ensuring data integrity and ease of data handling across the system.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>routes</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/user.router.js'>user.router.js</a></b></td>
								<td>- User.router.js establishes routes for managing user data within the application<br>- It includes endpoints for retrieving individual or all user details, listing privileged users, and modifying user privileges<br>- Authentication and authorization are enforced through middleware to ensure secure access based on user roles.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/floorPlan.router.js'>floorPlan.router.js</a></b></td>
								<td>- Defines routing for floor plan retrieval within the application, interfacing with the FloorPlanController to serve floor plan details via an HTTP GET request<br>- It supports the architecture by enabling the extraction of structured information about tables, doors, walls, and windows, crucial for client-side rendering or further processing within the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/door.router.js'>door.router.js</a></b></td>
								<td>- Manages door-related operations within the application, interfacing with the DoorController to handle CRUD operations on doors<br>- It ensures security through middleware that verifies user tokens and ownership, supporting operations like listing, retrieving, creating, updating, and deleting doors, with comprehensive API documentation provided via Swagger.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/window.router.js'>window.router.js</a></b></td>
								<td>- Window.router.js establishes the routing logic for window-related operations within the application, interfacing with the WindowController<br>- It handles API endpoints for creating, retrieving, updating, and deleting window records, ensuring access control through authentication and ownership verification middleware<br>- This integration facilitates secure and efficient window management in the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/table.router.js'>table.router.js</a></b></td>
								<td>- Manages table-related operations within a web application, interfacing through RESTful endpoints to handle tasks such as retrieving, creating, updating, deleting, and toggling the activation status of tables<br>- It integrates security and ownership checks to ensure authorized access and modifications to table data.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/openingHours.router.js'>openingHours.router.js</a></b></td>
								<td>- Manages the API endpoints for opening hours within the application, facilitating operations such as retrieving, creating, updating, and deleting opening hours<br>- It integrates authentication and ownership checks to ensure secure and authorized access to these functionalities.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/wall.router.js'>wall.router.js</a></b></td>
								<td>- Wall.router.js serves as a routing layer within the application, directing HTTP requests related to "walls" to appropriate controller actions<br>- It handles operations such as retrieving, creating, updating, and deleting walls, ensuring access control through middleware that verifies user identity and ownership.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/auth.router.js'>auth.router.js</a></b></td>
								<td>- Auth.router.js establishes the authentication routes for user operations within the application, interfacing with AuthController to handle actions like user registration, login, token refresh, and account management<br>- It integrates middleware for security and privilege checks, supporting both standard and Google-based authentication methods.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/routes/reservation.router.js'>reservation.router.js</a></b></td>
								<td>- Manages reservation-related operations within the application, interfacing with the ReservationController to handle tasks such as creating, canceling, confirming, completing, rescheduling, and retrieving reservations<br>- It ensures user authentication and authorization through middleware checks, supporting both individual and bulk reservation management actions.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>utils</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/utils/response.utils.js'>response.utils.js</a></b></td>
								<td>- Creates and structures response objects for the application, handling the encapsulation of status codes, messages, and optional data payloads<br>- This utility is pivotal for standardizing API responses across the system, ensuring consistency and clarity in communication between the server and clients<br>- It supports maintainability and scalability by centralizing response formatting logic.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/utils/counter.utils.js'>counter.utils.js</a></b></td>
								<td>- Counter.utils.js serves as a utility module within the application's architecture, primarily responsible for initializing various counter documents in a Firestore database<br>- It ensures that counters for tables, opening hours, walls, windows, and doors are set to zero if they do not already exist, facilitating consistent data tracking across the application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>services</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/window.service.js'>window.service.js</a></b></td>
								<td>- WindowService in `functions/app/services/window.service.js` manages window entities within a Firebase database<br>- It supports operations such as retrieving, creating, updating, and deleting windows, leveraging Firestore for data handling<br>- This service is crucial for manipulating window data across the application, ensuring data integrity and consistency.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/user.service.js'>user.service.js</a></b></td>
								<td>- UserService, located within the services layer of the application, manages user-related operations<br>- It facilitates user authentication, data retrieval, and privilege management by interfacing with Firebase<br>- Key functionalities include verifying user identities, fetching user details or lists from the database, and updating user privileges<br>- This component is essential for maintaining secure and efficient user data interactions within the system.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/table.service.js'>table.service.js</a></b></td>
								<td>- TableService in the application manages interactions with the database concerning table entities<br>- It facilitates operations such as retrieving, creating, updating, and deleting tables, as well as fetching tables based on minimum seat requirements<br>- This service utilizes Firebase for data storage and transactions, ensuring data integrity and consistency across operations.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/reservation.service.js'>reservation.service.js</a></b></td>
								<td>- ReservationService in `reservation.service.js` manages reservation data interactions within a restaurant booking system<br>- It facilitates checking for reservation overlaps, creating, updating, rescheduling, and retrieving reservations by various parameters such as user ID, time range, and status, ensuring efficient and conflict-free scheduling and management of table bookings.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/email.service.js'>email.service.js</a></b></td>
								<td>- EmailService in `functions/app/services/email.service.js` manages the dispatch of reservation status emails to users<br>- It supports sending emails for pending, confirmed, and cancelled reservations, leveraging template IDs and personalized content to ensure users receive accurate and timely updates about their bookings.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/door.service.js'>door.service.js</a></b></td>
								<td>- DoorService in the application's services layer manages door-related operations within a Firebase database<br>- It provides functionalities to retrieve, create, update, and delete door entries, as well as fetch all doors<br>- This service utilizes the Door model for data handling and interacts directly with the database for CRUD operations.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/wall.service.js'>wall.service.js</a></b></td>
								<td>- WallService in the application's service layer manages wall data interactions with the Firebase database<br>- It provides functionalities to create, retrieve, update, and delete wall records<br>- This service ensures data consistency and handles operations like fetching all walls or a specific wall by ID, updating wall dimensions, and maintaining a counter for wall IDs.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/auth.service.js'>auth.service.js</a></b></td>
								<td>- AuthService facilitates user management within the application by handling tasks such as user creation, login, token refresh, and account deletion across different user roles (customer, employee, owner) using Firebase Authentication and Firestore<br>- It supports operations like password resets and integrates Google sign-in for streamlined access management.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Unemployed-CS-Majors/RMS-API/blob/master/functions/app/services/openingHours.service.js'>openingHours.service.js</a></b></td>
								<td>- OpeningHoursService manages the lifecycle of opening hours data within the application<br>- It provides functionalities to create, retrieve, update, and delete opening hours information, interfacing with a Firebase database<br>- This service ensures data consistency and integrity through transactions, particularly when creating new entries.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---
##  Getting Started

###  Prerequisites

Before getting started with RMS-API, ensure your runtime environment meets the following requirements:

- **Programming Language:** JavaScript
- **Package Manager:** Npm


###  Installation

Install RMS-API using one of the following methods:

**Build from source:**

1. Clone the RMS-API repository:
```sh
❯ git clone https://github.com/Unemployed-CS-Majors/RMS-API
```

2. Navigate to the project directory:
```sh
❯ cd RMS-API
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```




###  Usage
Run RMS-API using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


###  Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```


---
##  Project Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/Unemployed-CS-Majors/RMS-API/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Unemployed-CS-Majors/RMS-API/issues)**: Submit bugs found or log feature requests for the `RMS-API` project.
- **💡 [Submit Pull Requests](https://github.com/Unemployed-CS-Majors/RMS-API/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Unemployed-CS-Majors/RMS-API
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Unemployed-CS-Majors/RMS-API/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Unemployed-CS-Majors/RMS-API">
   </a>
</p>
</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

---
