import {
  createUsers,
  deleteTestUsers,
  poolFromUrl,
  runGraphQLQuery,
  sanitize,
  setup,
  teardown,
} from "../helpers";

beforeEach(deleteTestUsers);
beforeAll(setup);
afterAll(teardown);

test("Login returns the authenticated user on LoginPayload.user", async () => {
  const pool = poolFromUrl(process.env.TEST_DATABASE_URL!);
  const client = await pool.connect();
  const [user] = await createUsers(client, 1, true);
  client.release();

  await runGraphQLQuery(
    `mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        user {
          id
          username
          name
        }
      }
    }`,

    { username: user.username, password: user._password },

    {
      login: jest.fn((_user: any, cb: () => void) => process.nextTick(cb)),
    },

    async (json) => {
      expect(json.errors).toBeFalsy();
      expect(json.data?.login?.user).toBeTruthy();
      expect(json.data!.login.user.username).toEqual(user.username);
      expect(sanitize(json.data!.login.user)).toMatchInlineSnapshot(`
{
  "id": "[id-1]",
  "name": "User a",
  "username": "[username-1]",
}
`);
    }
  );
});
