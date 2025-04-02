import { login } from "@/app/login/actions";
import User from "@/dbModels/User";
import connectDB from "@/lib/db";
import { createSession } from "@/lib/session";

jest.mock("@/lib/db", () => jest.fn());
jest.mock("@/dbModels/User", () => ({
  findOne: jest.fn(),
  comparePassword: jest.fn(),
}));
jest.mock("@/lib/session", () => ({
  createSession: jest.fn(),
}));

describe("login function", () => {
  let formData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();

    formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "Test1234!");
  });

  it("should return user data and a success message if login is successful", async () => {
    const mockUser = {
      email: "test@example.com",
      username: "testuser",
      comparePassword: jest.fn().mockResolvedValueOnce(true), // Valid password
      toPublicUser: jest.fn().mockReturnValueOnce({
        id: "123",
        username: "testuser",
        email: "test@example.com",
      }),
    };

    // Mock `User.findOne` to return the mock user
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    // Mock successful session creation
    (createSession as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await login(undefined, formData);

    expect(response.success?.message).toBe("Welcome testuser");
    expect(response.success?.user.username).toBe("testuser");
    expect(response.success?.user.email).toBe("test@example.com");

    expect(createSession).toHaveBeenCalledWith("123");
  });

  it("should return validation errors if form data is invalid", async () => {
    formData.set("email", "invalidemail"); // Invalid email format

    const response = await login(undefined, formData);
    expect(response.errors?.email).toEqual(["Invalid email address"]);
  });

  it("should return an error if the user is not found", async () => {
    // Mock the `User.findOne` to simulate no user found
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    const response = await login(undefined, formData);
    expect(response.errors?.email).toEqual(["User not found."]);
  });

  it("should return an error if the password is incorrect", async () => {
    const mockUser = {
      email: "test@example.com",
      comparePassword: jest.fn().mockResolvedValueOnce(false), // Invalid password
    };

    // Mock `User.findOne` to return the mock user
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const response = await login(undefined, formData);
    expect(response.errors?.password).toEqual(["Invalid credentials."]);
  });

  it("should return a server error if there's a database or unexpected error", async () => {
    // Mock a database connection failure
    (connectDB as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const response = await login(undefined, formData);
    expect(response.errors?.server).toBe(
      "Internal server error: Database error"
    );
  });
});
