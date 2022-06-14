import { rest } from "msw";
import { baseUrl } from "../config";
import { postsFixture } from "../fixtures/posts";

export const handlers = [
  rest.get(`${baseUrl}/posts`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(postsFixture))
  ),
  rest.get(`${baseUrl}/userinfo`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
];
