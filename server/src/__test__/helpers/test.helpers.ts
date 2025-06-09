import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import "dotenv/config";
import request from "supertest";
import { app } from "../../index.app";

const { ACCESS_TOKEN_SECRET } = process.env;

export const mockUserToken = jwt.sign(
  {
    email: "user@user.com",
    role: "user"
  },
  ACCESS_TOKEN_SECRET as string,
  { expiresIn: "1h" }
);

export const mockAnotherUserToken = jwt.sign(
  {
    email: "anotherUser@user.com",
    role: "user"
  },
  ACCESS_TOKEN_SECRET as string,
  { expiresIn: "1h" }
);

export const mockAdminToken = jwt.sign(
  {
    email: "admin@admin.com",
    role: "admin"
  },
  ACCESS_TOKEN_SECRET as string,
  { expiresIn: "1h" }
);

export const UserCookie = cookie.serialize("access_token", mockUserToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});

export const AnotherUserCookie = cookie.serialize(
  "access_token",
  mockAnotherUserToken,
  {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }
);

export const AdminCookie = cookie.serialize("access_token", mockAdminToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});

export function makeRandomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const createDeck = async () => {
  return request(app)
    .post("/api/decks")
    .set("Cookie", UserCookie)
    .send({
      name: makeRandomString(10)
    })
    .expect(201);
};

export const createAnotherDeck = async () => {
  return request(app)
    .post("/api/decks")
    .set("Cookie", AdminCookie)
    .send({
      name: makeRandomString(10)
    })
    .expect(201);
};

export const createUser = async () => {
  return request(app)
    .post("/api/users")
    .send({
      email: "user@user.com",
      password: "pAssw0rd!123",
      username: makeRandomString(10)
    })
    .expect(201);
};

export const mockUserAccessToken = (email: string) => {
  return jwt.sign(
    {
      email,
      role: "user"
    },
    ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" }
  );
};

export const mockCookie = (accessTokenMock: string) => {
  return cookie.serialize("access_token", accessTokenMock, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
};
