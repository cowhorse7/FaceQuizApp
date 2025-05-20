import { endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { userService } from '../../../services/user/user.ts';
import { byuAccountService } from '@fhss-web-team/backend-utils/services';
import { RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { User } from 'prisma/client';

type CallbackRequest = RequestData<null, null>;
type CallbackResponse = ResponseData<Omit<User, 'updatedAt' | 'createdAt'> & { createdAt: string; updatedAt: string }>;

export const authCallback = endpoint.get('/callback')<CallbackRequest, CallbackResponse>(async data => {
  if (!data.requester) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: 'No requesting user',
      },
    };
  }

  const foundUser = await userService.getUser({ netId: data.requester.username });
  if (foundUser) {
    return {
      body: {
        ...foundUser,
        createdAt: foundUser.createdAt.toISOString(),
        updatedAt: foundUser.updatedAt.toISOString(),
      },
    };
  }

  const acct = (await byuAccountService.getAccountsByNetId(data.requester.username))[0];
  if (!acct) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid requesting user',
      },
    };
  }

  const newuser = await userService.provisionUser(acct);
  return {
    body: {
      ...newuser,
      createdAt: newuser.createdAt.toISOString(),
      updatedAt: newuser.updatedAt.toISOString(),
    },
  };
});
