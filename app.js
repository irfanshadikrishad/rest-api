const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/rest-api");

const animeSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number,
  genre: Array,
});
const Animes = mongoose.model("Animes", animeSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app
  .route("/animes")
  .get((req, res) => {
    Animes.find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .post(async (req, res) => {
    console.log(req.body);
    const anime = new Animes({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      genre: req.body.genre,
    });
    anime
      .save()
      .then((data) => {
        console.log("—saved successfully");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .delete((req, res) => {
    Animes.deleteMany({})
      .then((data) => {
        console.log(data, "—wiped out");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });

app
  .route("/animes/:result")
  .get((req, res) => {
    let result = req.params.result;
    Animes.findOne({ title: result })
      .then((data) => {
        if (data != null) {
          res.send(data);
          console.log(result, "— found");
        } else {
          res.send("— not found");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .put((req, res) => {
    // change whole document
    let result = req.params.result;
    Animes.updateOne(
      { title: result },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwriteDiscriminatorKey: true }
    ).then((data) => {
      res.send("—updated successfully");
      console.log("—updated successfully");
    });
  })
  .patch((req, res) => {
    let result = req.params.result;
    Animes.updateOne(
      {
        title: result,
      },
      { $set: req.body }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .delete((req, res) => {
    let result = req.params.result;
    Animes.deleteOne({ title: result })
      .then((data) => {
        res.send("— deleted successfully");
        console.log(`—${result} deleted successfully`);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });

app.listen(3000, () => {
  console.log("listening to —3000");
});
