/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aboutProfile from "../aboutProfile.js";
import type * as auth from "../auth.js";
import type * as blogPosts from "../blogPosts.js";
import type * as bookSuggestions from "../bookSuggestions.js";
import type * as books from "../books.js";
import type * as covers from "../covers.js";
import type * as http from "../http.js";
import type * as migration from "../migration.js";
import type * as poems from "../poems.js";
import type * as reactions from "../reactions.js";
import type * as readingChallenges from "../readingChallenges.js";
import type * as seed from "../seed.js";
import type * as series from "../series.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aboutProfile: typeof aboutProfile;
  auth: typeof auth;
  blogPosts: typeof blogPosts;
  bookSuggestions: typeof bookSuggestions;
  books: typeof books;
  covers: typeof covers;
  http: typeof http;
  migration: typeof migration;
  poems: typeof poems;
  reactions: typeof reactions;
  readingChallenges: typeof readingChallenges;
  seed: typeof seed;
  series: typeof series;
  users: typeof users;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
