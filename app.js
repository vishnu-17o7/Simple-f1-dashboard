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

function executeQuery(query, res, params) {
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
}

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
  const query = 'SELECT forename, surname FROM drivers WHERE CONCAT(forename, " ", surname) LIKE ?';
  const searchTerm = `%${req.query.query}%`;

  connection.query(query, [searchTerm], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/driverData', (req, res) => {
  const driverName = req.query.driverName; 
  const surname = driverName.split(' ')[1];
  const forename = driverName.split(' ')[0];

  const querys = `
  SELECT
  d.forename AS DriverForename,
  d.surname AS DriverSurname,
  r.position AS Position,
  ra.name AS RaceName
FROM
  drivers d
JOIN
  results r ON d.driverId = r.driverId
JOIN
  races ra ON r.raceId = ra.raceId
WHERE
  d.driverId = (SELECT driverId
                FROM drivers
                WHERE forename = ? AND surname = ?)
  AND ra.year = ?
GROUP BY
  d.driverId, d.forename, d.surname,r.resultId;

  `;
    
  connection.query(querys, [forename,surname, req.query.year], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/driverStandings2023', (req, res) => {
  // Your query to get driver standings data for 2023
  const query = `
    SELECT
      d.forename AS DriverForename,
      d.surname AS DriverSurname,
      SUM(r.points) AS TotalPoints
    FROM
      drivers d
    JOIN
      results r ON d.driverId = r.driverId
    JOIN
      races ra ON r.raceId = ra.raceId
    WHERE
      ra.year = 2023
    GROUP BY
      d.driverId
    ORDER BY
      TotalPoints DESC;
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

app.get('/constructorStandings2023', (req, res) => {
  const query = `
    SELECT
      co.name AS ConstructorName,
      SUM(r.points) AS TotalPoints
    FROM
      constructors co
    JOIN
      results r ON co.constructorId = r.constructorId
    JOIN
      races ra ON r.raceId = ra.raceId
    WHERE
      ra.year = 2023
    GROUP BY
      co.constructorId
    ORDER BY
      TotalPoints DESC;
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

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
