import {FormData} from "../pages/Register/Register";
import { makeApiRequest } from "../../src/utils/ApiRequest";

export interface TeamDto {
  description: string;
  languages: string[];
  skillsetMask: number;
}

export const createTeam = async (formData: FormData): Promise<TeamDto> => {
  const team = teamFromForm(formData);
  await makeApiRequest("/posts", "POST", team);
  return team;
};

export const getTeam = async (): Promise<TeamDto | null> => {
  return (await makeApiRequest("/posts/mine", "GET")).json();
};

export const updateTeam = async (formData: FormData): Promise<TeamDto> => {
  const team = teamFromForm(formData);
  await makeApiRequest("/posts/mine", "PUT", team);
  return team;
};

export const deleteTeam = async (): Promise<Response> => {
  return makeApiRequest("/posts/mine", "DELETE");
};

export const reportTeam = async (teamId: string): Promise<Response> => {
  return await makeApiRequest(`/posts/report?teamId=${teamId}`, "POST");
};

/* Admin actions - refactor out of here later! */
export const getReportedTeams = async (): Promise<Response> => {
  return await makeApiRequest("/admin/reports", "GET");
};

export const getBannedUsers = async (): Promise<Response> => {
  return await makeApiRequest("/admin/banned-users", "GET");
};

export const adminBanUser = async (userId: string): Promise<Response> => {
  return await makeApiRequest(`/admin/ban-user?userId=${userId}`, "POST");
};


export const adminRedeemUser = async (discordId: string): Promise<Response> => {
  return await makeApiRequest(`/admin/redeem-user?userId=${discordId}`, "POST");
};

export const adminDeleteTeam = async (teamId: string): Promise<Response> => {
  return await makeApiRequest(`/admin/delete-team?teamId=${teamId}`, "DELETE");
};

export const adminClearReports = async (teamId: string): Promise<Response> => {
  return await makeApiRequest(`/admin/reports/clear?teamId=${teamId}`, "POST");
};


/**
 * Convert FormData to the format needed to create/update a Team record
 * @param formData
 */
const teamFromForm = (formData: FormData): TeamDto => {
  return {
    description: formData.description,
    languages: formData.languages,
    skillsetMask: formData.skillsets.reduce((a, b) => a + b, 0),
  };
};