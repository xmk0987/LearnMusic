import { registerUser } from "@/app/register/actions";
import User from "@/dbModels/User";
import connectDB from "@/lib/db";

jest.mock("@/lib/db", () => jest.fn());
jest.mock("@/dbModels/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("registerUser function", () => {
  let formData: FormData;

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();

    formData = new FormData();
    formData.append("username", "testuser");
    formData.append("email", "test@example.com");
    formData.append("password", "Test1234!");
  });

  it("should register a new user successfully if no errors", async () => {
    // Mock `User.findOne` to return null (no existing user)
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    // Mock `User.create` to simulate a successful user creation
    (User.create as jest.Mock).mockResolvedValueOnce({
      username: "testuser",
    });

    const response = await registerUser(undefined, formData);
    expect(response.success).toBe(
      "Registration successful! You can now login!"
    );
  });

  it("should return validation errors if form data is invalid", async () => {
    formData.set("username", "ab"); // invalid username (less than 3 chars)

    const response = await registerUser(undefined, formData);
    expect(response.errors?.username).toEqual([
      "Username must be at least 3 characters long.",
    ]);
  });

  it("should return an error if the email is already registered", async () => {
    // Mock the `User.findOne` to simulate an existing user
    (User.findOne as jest.Mock).mockResolvedValueOnce({
      email: "test@example.com",
    });

    const response = await registerUser(undefined, formData);
    expect(response.errors?.email).toEqual(["Email already registered."]);
  });

  it("should return an error if the username is already taken", async () => {
    // Mock the `User.findOne` to simulate an existing username
    (User.findOne as jest.Mock).mockResolvedValueOnce({ username: "testuser" });

    const response = await registerUser(undefined, formData);
    expect(response.errors?.username).toEqual(["Username already taken."]);
  });

  it("should return a server error if the registration fails", async () => {
    // Mock a database connection failure
    (connectDB as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const response = await registerUser(undefined, formData);
    expect(response.errors?.server).toBe(
      "Internal server error: Database error"
    );
  });
});
