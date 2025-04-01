import bcrypt from "bcryptjs";
import { CustomError } from "@/lib/customError";
import User from "@/server/dbModels/User";
import connectDB from "@/lib/db";
import { registerUser } from "@/server/services/authService";

jest.mock("@/lib/db");
jest.mock("bcryptjs");
jest.mock("@/server/dbModels/User");

describe("registerUser", () => {
  const mockUserSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    (connectDB as jest.Mock).mockResolvedValue(undefined);
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockUserSave.mockResolvedValue(undefined),
      _id: "12345",
    }));

    const result = await registerUser(
      "testuser",
      "test@example.com",
      "Password123!"
    );

    expect(connectDB).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: "test@example.com" }, { username: "testuser" }],
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("Password123!", 10);
    expect(mockUserSave).toHaveBeenCalled();
    expect(result).toEqual({
      id: "12345",
      username: "testuser",
      email: "test@example.com",
    });
  });

  describe("email validation", () => {
    it("should throw an error if user already exists with the same email", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      try {
        await registerUser("testuser", "test@example.com", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("User with this email already exists");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if email is not email format", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("testuser", "bademail.com", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Invalid email format");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if email is missing", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("testuser", "", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Email is required");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe("username validation", () => {
    it("should throw an error if user already exists with the same username", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue({
        username: "testuser",
      });

      try {
        await registerUser("testuser", "test@example.com", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Username is already taken");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if username is empty", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("", "test@example.com", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Username is required");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if username is too short", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("te", "test@example.com", "Password123!");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe(
            "Username must be at least 3 characters long"
          );
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if username is too long", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser(
          "testuserthathasatoolongname",
          "test@example.com",
          "Password123!"
        );
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Username can be only 20 characters long");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if username contains emojis", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser(
          "testuser😄💀😾",
          "test@example.com",
          "Password123!"
        );
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe("Username must not contain emojis");
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe("password validation", () => {
    it("should throw an error if password is missing", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("testuser", "test@example.com", "");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe(
            "Password must be at least 8 characters long"
          );
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if password is too short", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("testuser", "test@example.com", "short");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe(
            "Password must be at least 8 characters long"
          );
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if password doesn't have special character", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser("testuser", "test@example.com", "passwordnospecial2");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe(
            "Password must contain at least one special character"
          );
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });

    it("should throw an error if password doesn't have a number", async () => {
      (connectDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await registerUser(
          "testuser",
          "test@example.com",
          "passwordnospecial!"
        );
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe(
            "Password must contain at least one number"
          );
        }
      }
      expect(connectDB).toHaveBeenCalled();
    });
  });

  it("should handle database save errors", async () => {
    (connectDB as jest.Mock).mockResolvedValue(undefined);
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockUserSave.mockRejectedValue(new Error("DB Error")),
    }));

    await expect(
      registerUser("testuser", "test@example.com", "Password123!")
    ).rejects.toThrow("DB Error");
  });
});
