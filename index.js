//Dependencies
require("dotenv").config();
//Editable constants - Reddit
const url = "https://www.reddit.com/r/webdev/top.json?raw_json=1";
const maxDescriptionLength = 1200;
const maxPrevDateDays = 2;
//Editable constants - LinkedIn
const linkedInUserLocation = "https://api.linkedin.com/v2/userinfo";
const linkedInPostLocation = "https://api.linkedin.com/v2/ugcPosts";
//No edit needed
const maxPrevDateMiliseconds = maxPrevDateDays * 24 * 3600 * 1000;

//Get all reddit posts
async function getRedditPosts() {
  try {
    const callResult = await fetch(url);
    const finalResult = await callResult.json();
    if (finalResult.data.children.length > 0) {
      const inDatePosts = filterMaxDatePosts(finalResult.data.children);
      const postChosen = findBestPost(inDatePosts);
      return buildPost(postChosen);
    } else {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error("Couldn't retrieve any posts: ", error);
    return null;
  }
}

function filterMaxDatePosts(postsArray) {
  const todaysDate = new Date().getTime();
  const milisecondDifference = todaysDate - maxPrevDateMiliseconds;
  const insideDatePosts = postsArray.filter((post) => {
    return todaysDate - post.data.created_utc < milisecondDifference;
  });
  return insideDatePosts;
}

//Get the best post
function findBestPost(postsArrayFiltered) {
  const bestPost = postsArrayFiltered.reduce((best, post) => {
    return post.data.score > best.data.score ? post : best;
  }, postsArrayFiltered[0]);

  return bestPost;
}

//Convert to plain text
function convertRawDescription(description) {
  let plainText = description;
  if (plainText.length > maxDescriptionLength) {
    const maxLengthPlainText = plainText.substring(0, maxDescriptionLength);
    const lastSpaceIndex = maxLengthPlainText.lastIndexOf(" ");
    plainText = plainText.substring(0, lastSpaceIndex) + "...";
  }
  return plainText;
}

//Get all the necessary and processed information to post on LinkedIn
function buildPost(data) {
  const dataSource = data.data;
  const postTitle = dataSource.title;
  const rawPostDescription = dataSource.selftext;
  const postDescription = convertRawDescription(rawPostDescription);
  const postUrl = dataSource.url;
  return {
    postTitle,
    rawPostDescription,
    postDescription,
    postUrl,
  };
}

async function getUserId() {
  try {
    const response = await fetch(linkedInUserLocation, {
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const userId = userData.sub;
      return userId;
    } else {
      throw new Error("Failed to fetch user information from LinkedIn");
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
}

async function postInLinkedIn(postObject) {
  const userId = await getUserId();
  const response = await fetch(linkedInPostLocation, {
    method: "POST",
    headers: {
      "LinkedIn-Version": "202210",
      "X-Restli-Protocol-Version": "2.0.0",
      Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      author: `urn:li:person:${userId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: `${postObject.postTitle}`,
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: `${postObject.postUrl}`,
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });
  const responseText = await response.json();
  return responseText;
}

async function startProcess() {
  const postObject = await getRedditPosts();
  const response = await postInLinkedIn(postObject);
  console.log("Congratulations! ,", response);
}

startProcess();
