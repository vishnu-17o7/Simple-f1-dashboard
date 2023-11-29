const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'f1_database',
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to MySQL');
  }
});


app.get('/races', (req, res) => {

  const query = 'SELECT * FROM drivers';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(results);
    }
  });
});

app.get('/query2', (req, res) => {
    const query = `
      SELECT
        d.forename,
        d.surname,
        COUNT(r.resultId) AS Wins
      FROM
        drivers d
      JOIN
        results r ON d.driverId = r.driverId
      WHERE
        r.positionOrder = 1 AND r.points > 0 AND r.laps > 0
      GROUP BY
        d.driverId
      ORDER BY
        Wins DESC
      LIMIT 5;
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
  app.get('/query3', (req, res) => {
    const query = `
    SELECT
    ra.name AS RaceName,
    d.forename AS DriverForename,
    d.surname AS DriverSurname,
    co.name AS Constructor
    FROM
        races ra
    JOIN
        results r ON ra.raceId = r.raceId
    JOIN
        drivers d ON r.driverId = d.driverId
    JOIN
        constructors co ON r.constructorId = co.constructorId
    WHERE
        ra.year = 2023 AND r.positionOrder = 1
    ORDER BY
        ra.date;
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
app.get('/query4', (req, res) => {
    const query = `
    SELECT
    d.forename AS DriverForename,
    d.surname AS DriverSurname,
    ra.year,
    SUM(r.points) AS TotalPoints
    FROM
        drivers d
    JOIN
        results r ON d.driverId = r.driverId
    JOIN
        races ra ON r.raceId = ra.raceId
    GROUP BY
        d.driverId, ra.year
    ORDER BY
        TotalPoints DESC
    LIMIT 10;

    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
});

app.get('/query5', (req, res) => {
    const query = `
    SELECT
    d.forename AS DriverForename,
    d.surname AS DriverSurname,
    COUNT(CASE WHEN r.RaceRank <= 3 THEN 1 END) AS Podiums
    FROM
        drivers d
    JOIN
        results r ON d.driverId = r.driverId
    GROUP BY
        d.driverId
    ORDER BY
        Podiums DESC
    LIMIT 20;

    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
});

app.get('/query6', (req, res) => {
    const query = `
    SELECT
    d.forename AS DriverForename,
    d.surname AS DriverSurname,
    ra.year,
    AVG(r.points) AS AveragePointsPerRace
    FROM
        drivers d
    JOIN
        results r ON d.driverId = r.driverId
    JOIN
        races ra ON r.raceId = ra.raceId
    GROUP BY
        d.driverId, ra.year
    ORDER BY
        AveragePointsPerRace DESC
    LIMIT 20;
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
});

app.get('/query7', (req, res) => {
    const query = `
    SELECT
    d.forename AS DriverForename,
    d.surname AS DriverSurname,
    COUNT(CASE WHEN r.positionOrder = 1 THEN 1 END) AS Wins,
    COUNT(r.resultId) AS TotalRaces,
    (COUNT(CASE WHEN r.positionOrder = 1 THEN 1 END) / COUNT(r.resultId)) * 100 AS WinPercentage
    FROM
        drivers d
    JOIN
        results r ON d.driverId = r.driverId
    GROUP BY
        d.driverId
    HAVING
        TotalRaces >= 50
    ORDER BY
        WinPercentage DESC
    LIMIT 10;
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
});

app.get('/getDrivers', (req, res) => {
    const query = 'SELECT driverId, forename, surname FROM drivers';
    executeQuery(query, res);
  });


app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
