//Libs
import axios from "axios";

//Reddit types
type finishedPost = {
  postTitle: string;
  rawPostDescription: string;
  postDescription: string;
  postUrl: string;
};

//Get all reddit posts
export async function getRedditPosts(
  url: string,
  maxDescriptionLength: number,
  maxPrevDateMiliseconds: number
): Promise<finishedPost | null> {
  console.log("Start: Fetching reddit posts", url);
  try {
    const callResult = await axios.get(url);
    if (callResult.data.data.children.length > 0) {
      const inDatePosts = filterMaxDatePosts(
        callResult.data.data.children,
        maxPrevDateMiliseconds
      );
      const postChosen = findBestPost(inDatePosts);
      return buildPost(postChosen, maxDescriptionLength);
    } else {
      throw new Error("No posts found");
    }
  } catch (error) {
    console.error("Error: Fetch posts failed: ", error);
    return null;
  }
}

export function filterMaxDatePosts(
  postsArray: any[],
  maxPrevDateMiliseconds: number
): any[] {
  console.log("Start: Filtering reddit posts by date");
  const todaysDate = new Date().getTime();
  const minCreationTime = todaysDate - maxPrevDateMiliseconds;
  const insideDatePosts = postsArray.filter((post) => {
    return post.data.created_utc > minCreationTime;
  });
  return insideDatePosts;
}

//Get the best post
export function findBestPost(postsArrayFiltered: any[]) {
  console.log("Start: Searching for the best post");
  const bestPost = postsArrayFiltered.reduce((best, post) => {
    return post.data.score > best.data.score ? post : best;
  }, postsArrayFiltered[0]);
  return bestPost;
}

//Convert to plain text
export function convertRawDescription(
  description: string,
  maxDescriptionLength: number
): string {
  let plainText = description;
  if (plainText.length > maxDescriptionLength) {
    const maxLengthPlainText = plainText.substring(0, maxDescriptionLength);
    const lastSpaceIndex = maxLengthPlainText.lastIndexOf(" ");
    plainText = plainText.substring(0, lastSpaceIndex) + "...";
  }
  return plainText;
}

//Get all the necessary and processed information to post on LinkedIn
export function buildPost(
  data: any,
  maxDescriptionLength: number
): finishedPost {
  const dataSource = data.data;
  const postTitle = dataSource.title;
  const rawPostDescription = dataSource.selftext;
  const postDescription = convertRawDescription(
    rawPostDescription,
    maxDescriptionLength
  );
  const postUrl = dataSource.url;
  console.log("Post built with: ");
  console.log("postTitle: ", postTitle);
  console.log("postDescription: ", postDescription);
  console.log("rawPostDescription: ", rawPostDescription);
  console.log("postUrl: ", postUrl);
  return {
    postTitle,
    rawPostDescription,
    postDescription,
    postUrl,
  };
}
