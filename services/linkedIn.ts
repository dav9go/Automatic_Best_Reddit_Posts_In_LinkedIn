async function getUserId(linkedInUserLocation: string): Promise<string | null> {
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

export async function postInLinkedIn(
  postObject: any,
  linkedInUserLocation: string,
  linkedInPostLocation: string
) {
  const userId = await getUserId(linkedInUserLocation);
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
