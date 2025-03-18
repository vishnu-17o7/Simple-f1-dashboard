# Simple F1 Dashboard

## Overview
This project is a simple F1 dashboard that allows users to query and view various statistics and information about Formula 1 races, drivers, and constructors. The application is built using Node.js, Express, and MySQL.

## Project Structure
```
app.js
package.json
dataSets/
  circuits.sql
  constructors.sql
  drivers.sql
  races.sql
  results.sql
  status.sql
public/
  drivers.html
  f1_logo.svg
  graph2.html
  graphs.html
  index.html
  test.css
  test.html
```

## Installation
1. Clone the repository:
```bash
git clone <repository-url>
```
2. Navigate to the project directory:
```bash
cd Simple-f1-dashboard
```
3. Install the dependencies:
```bash
npm install
```

## Usage
1. Start the server:
```bash
node app.js
```
2. Open your web browser and go to `http://localhost:3000` to access the dashboard.

## Endpoints
- `/races`: Fetches all races.
- `/query2`: Fetches the top 5 drivers with the most wins.
- `/query3`: Fetches the race results for the year 2023.
- `/query4`: Fetches the top 10 drivers with the highest points in a single season.
- `/query5`: Fetches the top 20 drivers with the most podium finishes.
- `/query6`: Fetches the top 20 drivers with the highest average points per race in a season.
- `/query7`: Fetches the top 10 drivers with the highest win percentage (minimum 50 races).
- `/getDrivers`: Searches for drivers by name.
- `/driverData`: Fetches detailed race results for a specific driver in a specific year.
- `/driverStandings2023`: Fetches the driver standings for the year 2023.
- `/constructorStandings2023`: Fetches the constructor standings for the year 2023.

## Database
The project uses a MySQL database to store the data. The SQL scripts to create and populate the tables are located in the `dataSets` directory.

## Frontend
The frontend is a simple HTML/CSS/JavaScript application that allows users to interact with the backend API and view the results of the queries.

## License
This project is licensed under the MIT License.
