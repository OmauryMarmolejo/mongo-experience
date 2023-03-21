let express = require("express");
let path = require("path");
let fs = require("fs");
let MongoClient = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { "Content-Type": "image/jpg" });
  res.end(img, "binary");
});

let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

let mongoUrlDocker = "mongodb://admin:password@mongodb";

let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let databaseName = "user-account";

app.post("/update-profile", function (req, res) {
  let userObj = req.body;
  MongoClient.connect(
    mongoUrlDocker,
    mongoClientOptions,
    function (err, client) {
      if (err) throw err;

      let db = client.db(databaseName);
      userObj["userId"] = 1;

      let myquery = { userId: 1 };
      let newvalues = { $set: userObj };

      db.collection("users").updateOne(
        myquery,
        newvalues,
        { upsert: true },
        function (err, res) {
          if (err) throw err;
          client.close();
        }
      );
    }
  );
  res.send(userObj);
});

app.get("/get-profile", function (req, res) {
  let response = {};

  MongoClient.connect(
    mongoUrlLocal,
    mongoClientOptions,
    function (err, client) {
      console.log("Connected successfully to server");
      if (err) throw err;

      let db = client.db(databaseName);

      let myquery = { userId: 1 };

      db.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err;
        response = result;
        client.close();

        res.send(response ? response : {});
      });
    }
  );
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
