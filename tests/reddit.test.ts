import {
  filterMaxDatePosts,
  findBestPost,
  convertRawDescription,
  buildPost,
} from "../services/reddit";

describe("filterMaxDatePosts", () => {
  it("should filter posts correctly based on maximum date", () => {
    const posts = [
      { data: { created_utc: Date.now() - 10000 } },
      { data: { created_utc: Date.now() - 20000 } },
      { data: { created_utc: Date.now() - 100000 } },
    ];

    const maxPrevDateMiliseconds = 30000;
    const filteredPosts = filterMaxDatePosts(posts, maxPrevDateMiliseconds);

    expect(filteredPosts).toHaveLength(2);
  });
});

import {} from "../services/reddit";

describe("findBestPost", () => {
  it("should find the post with the highest score", () => {
    const posts = [
      { data: { score: 10 } },
      { data: { score: 20 } },
      { data: { score: 15 } },
    ];

    const bestPost = findBestPost(posts);

    expect(bestPost.data.score).toEqual(20);
  });
});

describe("convertRawDescription", () => {
  it("should truncate long descriptions correctly", () => {
    const longDescription =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const maxDescriptionLength = 50;

    const truncatedDescription = convertRawDescription(
      longDescription,
      maxDescriptionLength
    );

    expect(truncatedDescription.length).toBeLessThanOrEqual(
      maxDescriptionLength + 3
    );
    expect(truncatedDescription.endsWith("...")).toBe(true);
  });

  it("should not truncate short descriptions", () => {
    const shortDescription = "Short description.";
    const maxDescriptionLength = 50;

    const truncatedDescription = convertRawDescription(
      shortDescription,
      maxDescriptionLength
    );

    expect(truncatedDescription).toEqual(shortDescription);
  });
});

describe("buildPost", () => {
  it("should build the post object correctly", () => {
    const dataSource = {
      data: {
        title: "Test Post",
        selftext: "This is a test post.",
        url: "https://www.reddit.com/test",
      },
    };
    const maxDescriptionLength = 100;

    const post = buildPost(dataSource, maxDescriptionLength);

    expect(post.postTitle).toEqual(dataSource.data.title);
    expect(post.rawPostDescription).toEqual(dataSource.data.selftext);
    expect(post.postDescription.length).toBeLessThanOrEqual(
      maxDescriptionLength
    );
    expect(post.postUrl).toEqual(dataSource.data.url);
  });
});
