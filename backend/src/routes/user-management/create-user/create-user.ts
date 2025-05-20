import { endpoint, RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { FormattedUser } from '../user-management.types.ts';
import { keycloakApi, byuApi } from '@fhss-web-team/backend-utils/apis';
import { Prisma } from 'prisma/client';
import { userService } from '../../../services/user/user.ts';
import { DEFAULT_ROLE } from '../../api.roles.ts';

type CreateUserRequest = RequestData<{ role_name: string }, null>;
type CreateUserResponse = ResponseData<FormattedUser>;

export const createUser = endpoint.post('/:netId')<CreateUserRequest, CreateUserResponse>(async data => {
  try {
    const role = await keycloakApi.getAppRole(data.query?.role_name ?? DEFAULT_ROLE);
    if (!role) {
      return {
        status: 400,
        error: { message: `Role '${data.query?.role_name}' does not exist` },
      };
    }

    const acct = (await byuApi.getBasicAccountsByNetId(data.params.netId))[0];
    if (!acct) {
      return {
        status: 400,
        error: { message: `Account '${data.params.netId}' does not exist` },
      };
    }

    const user = await userService.createUser(acct, role);

    return {
      body: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: [role.name],
      },
    };
  } catch (err) {
    // P2002 means that the query failed unique property constraint. ie: it already exists
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        error: { code: 'CONFLICT' },
        status: 409,
      };
    }
    throw err;
  }
});