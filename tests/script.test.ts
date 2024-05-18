import { startProcess } from "../script";
import { postInLinkedIn } from "../services/linkedIn";
import { getRedditPosts } from "../services/reddit";

jest.mock("../services/reddit");
jest.mock("../services/linkedIn");

describe("startProcess", () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    jest.resetAllMocks();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  it("should call getRedditPosts and postInLinkedIn with correct arguments", async () => {
    const mockPostObject = {
      postTitle: "Post title",
      rawPostDescription: "Auto reddit top post of the day - \n",
      postDescription: "Auto reddit top post of the day -",
      postUrl:
        "https://www.reddit.com/r/reactjs/comments/1cugfdd/nextjs_app_router_feel_fundamentally_broken_on",
    };

    const mockResponse = { id: "urn:li:share:7197559584910118912" };

    (getRedditPosts as jest.Mock).mockResolvedValue(mockPostObject);
    (postInLinkedIn as jest.Mock).mockResolvedValue(mockResponse);

    await startProcess();

    expect(getRedditPosts).toHaveBeenCalledWith(
      "https://www.reddit.com/r/programmerHumor/top.json?raw_json=1",
      1200,
      1 * 24 * 3600 * 1000
    );

    expect(postInLinkedIn).toHaveBeenCalledWith(
      mockPostObject,
      "https://api.linkedin.com/v2/userinfo",
      "https://api.linkedin.com/v2/ugcPosts",
      false
    );

    expect(console.log).toHaveBeenCalledWith(
      "Process ended successfully! ,",
      mockResponse
    );
  });

  it("should handle errors correctly", async () => {
    const mockError = new Error("Test Error");
    (getRedditPosts as jest.Mock).mockRejectedValue(mockError);

    await startProcess();

    expect(console.log).toHaveBeenCalledWith("Application error: ", mockError);
  });
});
