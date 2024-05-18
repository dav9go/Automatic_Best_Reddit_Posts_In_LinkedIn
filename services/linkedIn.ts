export async function getUserId(
  linkedInUserLocation: string
): Promise<string | null> {
  try {
    const response = await fetch(linkedInUserLocation, {
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const userId = userData.sub;
      return userId || null;
    } else {
      throw new Error("Failed to fetch user information from LinkedIn");
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
}

export async function postInLinkedIn(
  postObject: any,
  linkedInUserLocation: string,
  linkedInPostLocation: string,
  justTry: boolean
) {
  let responseText = "Just trying";
  const userId = await getUserId(linkedInUserLocation);
  if (!justTry) {
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
              text: `Auto reddit top post of the day - ${postObject.postTitle}\n`,
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
    responseText = await response.json();
  }

  return responseText || null;
}
