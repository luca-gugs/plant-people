import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Auth ───

// Shared auth guard for mutations. Throws if the user is not authenticated or
// not found. Queries that need to return empty results instead of throwing
// should inline the check directly.
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  const user = await ctx.db.get("users", userId);
  if (user === null) throw new Error("User not found");
  return { userId, user };
}

// ─── Database ───

// Batch-delete all documents returned by fetchBatch until the table is empty.
// fetchBatch should always apply the same filter — each call returns the next
// batch of remaining documents (not a paginated cursor).
//
// Usage:
//   await batchDelete(ctx, () =>
//     ctx.db.query("readings")
//       .withIndex("by_plantBoxId_and_timestamp", (q) => q.eq("plantBoxId", id))
//       .take(256)
//   );
//
// WARNING: If new tables reference the documents being deleted, add their
// deletion here or in the calling mutation to avoid orphaned data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function batchDelete(
  ctx: MutationCtx,
  fetchBatch: () => Promise<Array<{ _id: any }>>
): Promise<void> {
  let items = await fetchBatch();
  while (items.length > 0) {
    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
    items = await fetchBatch();
  }
}
