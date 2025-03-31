import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { registerUser } from "@/server/services/authService";
import { CustomError } from "@/lib/customError";

// Mock necessary modules
jest.mock("bcryptjs");
jest.mock("@/lib/mongodb", () => ({
  getDb: jest.fn(),
}));

describe("registerUser", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbMock: any;

  beforeEach(() => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

    dbMock = {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: "123" }),
        findOne: jest.fn().mockResolvedValue(null),
      }),
    };
    (getDb as jest.Mock).mockResolvedValue(dbMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully register a new user", async () => {
    const username = "john_doe";
    const email = "john@example.com";
    const password = "password123";

    const result = await registerUser(username, email, password);

    expect(result).toHaveProperty("id", "123");
    expect(result.username).toBe(username);
    expect(result.email).toBe(email);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

    expect(dbMock.collection().insertOne).toHaveBeenCalledWith({
      username,
      email,
      password: "hashedPassword123",
      createdAt: expect.any(Date),
    });
  });

  it("should throw a CustomError if the user already exists", async () => {
    dbMock.collection().findOne.mockResolvedValue({
      email: "john@example.com",
    });

    const username = "john_doe";
    const email = "john@example.com";
    const password = "password123";

    await expect(registerUser(username, email, password)).rejects.toThrow(
      new CustomError(400, "User already exists")
    );

    expect(dbMock.collection().findOne).toHaveBeenCalledWith({ email });
  });
});
