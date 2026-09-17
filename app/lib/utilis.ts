import { Team, User } from "../types";

export function transformUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    teamId: user.teamId || undefined,
    team: user.team ? transformTeam(user.team) : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function transformUsers(users: any[]): User[] {
  return users.map(transformUser);
}

export function transformTeam(team: any): Team {
  return {
    id: team.id,
    name: team.name,
    description: team.description || undefined,
    code: team.code,
    members: team.members ? transformUsers(team.members) : undefined,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}

export function transformTeams(teams: any[]): Team[] {
  return teams.map(transformTeam);
}