import axios from "axios";

const DB = "https://jsonplaceholder.typicode.com/posts";

export async function getPosts(pages) {
  if (pages) {
    const posts = await axios(`https://jsonplaceholder.typicode.com/posts?_page=${pages}&_limit=10`);
    return posts.data;
  } else {
    const posts = await axios(`https://jsonplaceholder.typicode.com/posts`);
    return posts.data;
  }
}

export async function updatePartialPosts(id, partialPostToUpdate) {
  const { data } = await axios(DB);
  console.log(data);

  const postIndex = data.findIndex((p) => {
    return p.id == id;
  });
  if (postIndex == -1) {
    return { error: "404, not found" };
  }

  const post = data[postIndex];

  const updatedPost = { ...post, ...partialPostToUpdate };
  //Faltaria guardar updatedPost en la DB pero obviamente no puedo porque es una api ajena
  return updatedPost;
}
