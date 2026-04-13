export const getPagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit)

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  }
}

export const buildPaginationMeta = (totalItems, page, limit) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
})
