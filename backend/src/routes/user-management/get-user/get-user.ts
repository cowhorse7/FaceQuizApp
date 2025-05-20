import { userService } from '../../../services/user/user.ts';
import { keycloakApi } from '@fhss-web-team/backend-utils/apis';
import { endpoint, RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { FormattedUser } from '../user-management.types.ts';

type GetUserRequest = RequestData<null, null>;
type GetUserResponse = ResponseData<FormattedUser | null>;

export const getUser = endpoint.get('/:userId')<GetUserRequest, GetUserResponse>(async data => {
  const user = await userService.getUser({ userId: data.params.userId });
  if (!user) {
    return {
      error: {
        code: 'NOT_FOUND',
      },
      status: 404,
    };
  }

  const roles = await keycloakApi.getUserAppRoles(user.keycloakId);

  return {
    body: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      roles: roles.map(role => role.name),
    },
  };
});