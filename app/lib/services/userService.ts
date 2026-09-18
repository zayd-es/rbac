import { PaginatedResponse, User } from "@/app/types";
import { parsePaginationParams } from "../parsePaginationParams";
import db from "../db";
import { transformUsers } from "../utilis";

export async function getPaginatedUsers(searchParams: {
  page?: string;
  limit?: string;
}): Promise<PaginatedResponse<User>> {
  const { page, limit, skip } = parsePaginationParams(searchParams);

  const [prismaUsers, totalCount] = await Promise.all([
    db.user.findMany({
      skip,
      take: limit,
      include: { team: true },
      orderBy: { createdAt: "desc" },
    }),
    db.user.count(),
  ]);

  const data = transformUsers(prismaUsers);

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  return {
    data,
    meta: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
}
