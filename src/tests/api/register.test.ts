import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/auth/register";
import { registerUser } from "@/server/services/authService";
import { CustomError } from "@/lib/customError";

jest.mock("@/lib/db", () => jest.fn());
jest.mock("@/server/dbModels/User", () => ({
  findOne: jest.fn(),
  save: jest.fn(),
}));
jest.mock("@/server/services/authService", () => ({
  registerUser: jest.fn(),
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    (registerUser as jest.Mock).mockResolvedValue({
      id: "123",
      username: "john_doe",
      email: "john@example.com",
    });
  });

  it("should return new user on success and status 201", async () => {
    const newUser = {
      username: "john_doe",
      email: "john@example.com",
      password: "password123",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(201);
    expect(responseData).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: "123",
          username: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  it("should return 400 if username is missing", async () => {
    const newUser = {
      email: "john@example.com",
      password: "password123",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(400);
    expect(responseData.error).toBe("All fields are required");
  });

  it("should return 400 if email is missing", async () => {
    const newUser = {
      username: "john_doe",
      password: "password123",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(400);
    expect(responseData.error).toBe("All fields are required");
  });

  it("should return 400 if password is missing", async () => {
    const newUser = {
      username: "john_doe",
      email: "john@example.com",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(400);
    expect(responseData.error).toBe("All fields are required");
  });

  it("should return 405 if request is not POST", async () => {
    const newUser = {
      username: "john_doe",
      email: "john@example.com",
    };

    const { req, res } = createMocks({
      method: "GET",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(405);
    expect(responseData.error).toBe("Method Not Allowed");
  });

  it("should return status given by Custom Error with its message", async () => {
    (registerUser as jest.Mock).mockRejectedValueOnce(
      new CustomError(400, "User already exists")
    );

    const newUser = {
      username: "john_doe",
      email: "john@example.com",
      password: "password123",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: newUser,
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());

    expect(res.statusCode).toBe(400);
    expect(responseData.error).toBe("User already exists");
  });
});
