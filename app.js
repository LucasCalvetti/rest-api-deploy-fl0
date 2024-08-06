import express from "express";
import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import { getPosts, updatePartialPosts } from "./controllers/posts.js";
import { validatePosts, validatePartialPosts } from "./schemas/post.js";

const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:5500"];
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }
    },
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3000;

//const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:5500"];
app.get("/api/posts", async (req, res) => {
  //const origin = req.header("origin");

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { pages } = req.query;
  let result;

  try {
    if (pages) {
      result = await getPosts(pages);
    } else {
      result = await getPosts();
    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//POST posts

var posts = [];
app.post("/api/posts", (req, res) => {
  const result = validatePosts(req.body);
  if (result.error) {
    res.status(400).send({ error: result.error.message });
  }
  const newPost = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  posts.push(newPost);

  res.status(201).send(posts);
});

//PATCH

app.patch("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  const result = validatePartialPosts(req.body);
  if (!result.success) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const updatedPost = await updatePartialPosts(id, req.body);
  res.send(updatedPost);
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
