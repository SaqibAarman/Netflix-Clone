const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

// CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();

      res.status(201).json(savedMovie);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You Are Not Allowed!");
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedMovie);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You Are Not Allowed!");
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);

      res.status(200).json("SuccessFully Deleted Movie...");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You Are Not Allowed!");
  }
});

// GET MOVIES
router.get("/find/:id", async (req, res) => {
  try {
    const movies = await Movie.findById(req.params.id);

    res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET RANDOM MOVIE
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        {
          $match: {
            isSeries: true,
          },
        },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        {
          $match: {
            isSeries: false,
          },
        },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL MOVIES
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();

      res.status(200).json(movies.reverse());
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You Are Not Allowed!");
  }
});

module.exports = router;
