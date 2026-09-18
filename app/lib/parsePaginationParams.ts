export function parsePaginationParams(searchParams: {
  page?: string;
  limit?: string;
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(searchParams.limit || "10", 10) || 10),
  );

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
