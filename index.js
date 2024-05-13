//Dependencies
require("dotenv").config();
//Functions
const { postInLinkedIn } = require("./linkedIn.js");
const { getRedditPosts } = require("./reddit.js");
//Editable constants - Reddit
const url = "https://www.reddit.com/r/webdev/top.json?raw_json=1";
const maxDescriptionLength = 1200;
const maxPrevDateDays = 2;
//Editable constants - LinkedIn
const linkedInUserLocation = "https://api.linkedin.com/v2/userinfo";
const linkedInPostLocation = "https://api.linkedin.com/v2/ugcPosts";
//No edit needed
const maxPrevDateMiliseconds = maxPrevDateDays * 24 * 3600 * 1000;

async function startProcess() {
  const postObject = await getRedditPosts(
    url,
    maxDescriptionLength,
    maxPrevDateMiliseconds
  );
  const response = await postInLinkedIn(
    postObject,
    linkedInUserLocation,
    linkedInPostLocation
  );
  console.log("Process ended successfully! ,", response);
}

startProcess();
