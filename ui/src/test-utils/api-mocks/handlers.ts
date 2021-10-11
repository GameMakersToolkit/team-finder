import { rest } from "msw";
import { baseUrl } from "../config";
import * as teamsFixtures from "../fixtures/teams";

export const handlers = [
  rest.get("/Flag.svg", (req, res, ctx) => res(ctx.status(200))),
  rest.get("/spinner.svg", (req, res, ctx) => res(ctx.status(200))),
  rest.get("/SkillsetIcons/:file", (req, res, ctx) => res(ctx.status(200))),

  rest.get(`${baseUrl}/teams`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(teamsFixtures.teamList))
  ),
];
