async function justfetch() {
  const callResult = await fetch("https://www.reddit.com/r/redditdev.json");
  console.log(await callResult.json());
}

justfetch();
