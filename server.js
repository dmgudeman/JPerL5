var express = require('express')
  , app = express()
  , pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://postgres:Printer238@localhost:5433/JPerL'
  , start = new Date()
  , port = 3000
  , client
  , bodyParser = require('body-parser');


client = new pg.Client(connectionString);
client.connect();
//var flash = require('express-flash');

//app.configure(function(){
  //  app.use(flash());
   // app.use(express.cookieParser('keyboard cat'));
   // app.use(express.session({ cookie: { maxAge: 60000 }, secret: 'topsecret'}));
    app.use(bodyParser.urlencoded({extended: false}));
   // app.use(app.router);
   // app.use(express.compress());
    app.use(express.static(__dirname + '/JPerL4View/public'));    
//});

app.post('/api/song', function(req, res) {
  console.log("req: " + JSON.stringify(req.body));
  var title = req.body.title;
  var location = req.body.location;
  var format = req.body.format;
  var notes = req.body.notes;
  var artist = req.body.artist;
  var genre = req.body.genre;
  var songs = [];
  client.query('INSERT INTO songs(title, location, format, notes, artist, genre) VALUES($1, $2, $3, $4, $5, $6)', [title, location, format, notes, artist, genre]);
  
  query = client.query('SELECT * FROM songs');
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
     // return res.send('No data found');
    } else {
      songs.push({title: result.title, artist: result.artist});
    }
  }); 
  query.on( 'end', function() {
  res.send(songs);
    client.end();
});
//req.flash('info', 'song inserted');
//res.send("inserted song");
});

// textArea in songView
app.get('/api/songs', function(req, res) {
  var songString = "";
  query = client.query('SELECT title FROM songs');

  query.on('row', function(result) {
   console.log(JSON.stringify(result)); 
   console.log("hello");
    if (!result) {

     return res.send('No data found');
    } else {
     //  var songString = "";
      //for(var i = 0; i < result.length; i++){
       // songString 
      //}
     //res.send('Song: ' + result.title);
     songString += (result.title + "<br />");
    }
  }); 
//req.flash('info', 'song inserted');
query.on( 'end', function() {
  res.send(songString);
    client.end();
});
//res.send("inserted song");
});
app.listen(port, function() {
  console.log('Listening on:', port);
});
