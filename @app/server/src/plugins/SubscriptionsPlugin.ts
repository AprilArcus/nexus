import type { JSONValue } from "@dataplan/json";
import { jsonParse } from "@dataplan/json";
import type { ExecutableStep } from "grafast";
import { access, context, lambda, listen, SafeError } from "grafast";
import { extendSchema, gql } from "graphile-utils";
import type { Pool } from "pg";

/*
 * PG NOTIFY events are sent via a channel, this function helps us determine
 * which channel to listen to for the currently logged in user by extracting
 * their `user_id` from their session record.
 *
 * NOTE: channels are limited to 63 characters in length (this is a PostgreSQL
 * limitation).
 */
async function userIdFromSession([sessionId, pool]: readonly [
  string | null,
  Pool,
]): Promise<string | null> {
  if (!sessionId || !pool) return null;
  const { rows } = await pool.query<{ user_id: string }>(
    `SELECT user_id FROM app_private.sessions WHERE uuid = $1`,
    [sessionId]
  );
  return rows[0]?.user_id ?? null;
}

function currentUserTopicByUserId(userId: string | null) {
  if (userId) {
    return `graphql:user:${userId}`;
  } else {
    throw new SafeError("You're not logged in");
  }
}

/*
 * This plugin adds a number of custom subscriptions to our schema. By making
 * sure our subscriptions are tightly focussed we can ensure that our schema
 * remains scalable and that developers do not get overwhelmed with too many
 * subscription options being open. You can also use external sources of realtime
 * data when PostgreSQL's LISTEN/NOTIFY is not sufficient.
 *
 * Read more about this in the PostGraphile documentation:
 *
 * https://www.graphile.org/postgraphile/subscriptions/#custom-subscriptions
 *
 * And see the database trigger function `app_public.tg__graphql_subscription()`.
 */
const SubscriptionsPlugin = extendSchema((build) => {
  const usersResource = Object.values(build.input.pgRegistry.pgResources).find(
    (s) =>
      !s.parameters &&
      s.extensions?.pg?.schemaName === "app_public" &&
      s.extensions.pg.name === "users"
  );
  if (!usersResource) {
    throw new Error("Couldn't find source for app_public.users");
  }

  return {
    typeDefs: gql`
      type UserSubscriptionPayload {
        user: User # Populated by our resolver below
        event: String # Part of the NOTIFY payload
      }

      extend type Subscription {
        """
        Triggered when the logged in user's record is updated in some way.
        """
        currentUserUpdated: UserSubscriptionPayload
      }
    `,
    objects: {
      Subscription: {
        plans: {
          currentUserUpdated: {
            subscribePlan() {
              const $pgSubscriber = context().get("pgSubscriber");
              const $sessionId = context().get("sessionId");
              const $rootPgPool = context().get("rootPgPool");
              // We have the users session ID, but to get their actual ID we
              // need to ask the database.
              const $userId = lambda(
                [$sessionId, $rootPgPool],
                userIdFromSession
              ) as ExecutableStep<string | null>;
              const $topic = lambda($userId, currentUserTopicByUserId);
              return listen($pgSubscriber, $topic, (e) => e);
            },
            plan($e) {
              return jsonParse<TgGraphQLSubscriptionPayload & JSONValue>($e);
            },
          },
        },
      },
      UserSubscriptionPayload: {
        plans: {
          user($obj: ExecutableStep<TgGraphQLSubscriptionPayload>) {
            const $id = access($obj, "subject");
            return usersResource.get({ id: $id });
          },
        },
      },
    },
  };
});

/* The JSON object that `tg__graphql_subscription()` delivers via NOTIFY */
interface TgGraphQLSubscriptionPayload {
  event: string;
  subject: string | null;
  id: string;
}

export default SubscriptionsPlugin;
