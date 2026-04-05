import { asRoot } from "../../../__tests__/helpers";
import {
  createUserAndLogIn,
  deleteTestUsers,
  runGraphQLQuery,
  setup,
  teardown,
} from "../helpers";

beforeEach(deleteTestUsers);
beforeAll(setup);
afterAll(teardown);

test("Logout succeeds and deletes the session", async () => {
  const { session } = await createUserAndLogIn();

  await runGraphQLQuery(
    `mutation {
      logout {
        success
      }
    }`,

    {},

    {
      user: { session_id: session.uuid },
      logout: jest.fn((cb: (err?: Error) => void) => process.nextTick(cb)),
    },

    async (json, { pgClient }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data!.logout.success).toBe(true);

      // Verify the session row was deleted
      const { rows } = await asRoot(pgClient, () =>
        pgClient.query(`SELECT 1 FROM app_private.sessions WHERE uuid = $1`, [
          session.uuid,
        ])
      );
      expect(rows).toHaveLength(0);
    }
  );
});
