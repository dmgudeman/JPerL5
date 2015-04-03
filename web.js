var express = require('express')
  , app = express.createServer(express.logger())
  , pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:Printer238@localhost:5433/JPerL'
  , start = new Date()
  , port = process.env.PORT || 3000
  , client;

client = new pg.Client(connectionString);
client.connect();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.compress());
    app.use(express.static(__dirname + '/JPerL4View/public'));
});

app.get('/api/song', function(req, res) {
  console.log("req: " + JSON.stringify(req.query));
  var title = req.query.title;
  var location = req.query.location;
  var format = req.query.format;
  var notes = req.query.notes;
  var artist = req.query.artist;
  var genre = req.query.genre;

  client.query('INSERT INTO songs(title, location, format, notes, artist, genre) VALUES($1, $2, $3, $4, $5, $6)', [title, location, format, notes, artist, genre]);

  query = client.query('SELECT * FROM songs');
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
      res.send('Song: ' + result.title);
    }
  }); 

res.send("inserted song");
});

app.listen(port, function() {
  console.log('Listening on:', port);
});
