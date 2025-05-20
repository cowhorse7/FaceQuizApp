import { createUser } from "./functions/users/create-user.ts";
import { createUsers } from "./functions/users/create-users.ts";
import { deleteUsers } from "./functions/users/delete-users.ts";
import { DummyFunction } from '@fhss-web-team/backend-utils/dummy';

// deno-lint-ignore no-explicit-any
export const dummyFunctions: DummyFunction<any>[] = [
	deleteUsers,
	createUsers,
	createUser,
];