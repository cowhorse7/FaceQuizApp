import { getDeck } from './decks/get-deck/get-deck.ts'
import { getDecks } from './decks/get-decks/get-decks.ts'
import { deleteDeck } from './decks/delete-deck/delete-deck.ts'
import { updateDeck } from './decks/update-deck/update-deck.ts'
import { createDeck } from './decks/create-deck/create-deck.ts'
import { Route } from '@fhss-web-team/backend-utils/endpoint';
import { authCallback } from './auth/callback/auth-callback.ts';
import { createUser } from './user-management/create-user/create-user.ts';
import { deleteUser } from './user-management/delete-user/delete-user.ts';
import { getUser } from './user-management/get-user/get-user.ts';
import { getUsers } from './user-management/get-users/get-users.ts';

export const routes: Route[] = [
	{
		path: "/auth",
		endpoints: [{ data: authCallback, allowedRoles: 'PUBLIC ENDPOINT' }]
	},
  {
    path: '/user-management',
    endpoints: [
      { data: getUsers, allowedRoles: ['admin'] },
      { data: getUser, allowedRoles: ['admin'] },
      { data: deleteUser, allowedRoles: ['admin'] },
      { data: createUser, allowedRoles: ['admin'] },
    ],
  },
	{
		path: '/decks',
    endpoints: [
      { data: getDeck, allowedRoles: ['user'] },
      { data: getDecks, allowedRoles: ['user'] },
      { data: deleteDeck, allowedRoles: ['user'] },
      { data: updateDeck, allowedRoles: ['user'] },
      { data: createDeck, allowedRoles: ['user'] },
    ]
	},
];
