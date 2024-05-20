//Dependencies
import dotenv from "dotenv";
// Functions
import { postInLinkedIn } from "./services/linkedIn";
import { getRedditPosts } from "./services/reddit";
//Editable constants - Reddit
const url: string = "https://www.reddit.com/r/reactjs/top.json?raw_json=1";
const maxDescriptionLength: number = 1200;
const maxPrevDateDays: number = 1;
const justTry: boolean = true;
//Editable constants - LinkedIn
const linkedInUserLocation: string = "https://api.linkedin.com/v2/userinfo";
const linkedInPostLocation: string = "https://api.linkedin.com/v2/ugcPosts";
//No edit needed
const maxPrevDateMiliseconds: number = maxPrevDateDays * 24 * 3600 * 1000;

dotenv.config();

export async function startProcess(): Promise<void> {
  try {
    const postObject = await getRedditPosts(
      url,
      maxDescriptionLength,
      maxPrevDateMiliseconds
    );
    const response = await postInLinkedIn(
      postObject,
      linkedInUserLocation,
      linkedInPostLocation,
      justTry
    );

    console.log("Process ended successfully! ,", response);
  } catch (error) {
    console.log("Application error: ", error);
  }
}

startProcess();
