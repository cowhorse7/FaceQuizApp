import { keycloakApi } from '@fhss-web-team/backend-utils/apis';
import { userService } from '../../../services/user/user.ts';
import { FormattedUser } from '../user-management.types.ts';
import { endpoint, RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';

type addRolesToUserRequest = RequestData<{ role_names: string }, null>;
type addRolesToUserResponse = ResponseData<FormattedUser>;

export const addRolesToUser = endpoint.put('/:userId/roles')<addRolesToUserRequest, addRolesToUserResponse>(
  async data => {
    if (!data.query?.role_names) {
      return {
        status: 400,
        error: { message: 'No roles requested' },
      };
    }

    const user = await userService.getUser({ userId: data.params.userId });
    if (!user) {
      return {
        status: 400,
        error: { message: 'Specified user does not exist' },
      };
    }

    const roleNames = new Set(data.query.role_names.split(','));
    const allRoles = await keycloakApi.getAppRoles();
    const roles = allRoles.filter(role => roleNames.has(role.name));

    if (roles.length !== roleNames.size) {
      return {
        status: 400,
        error: {
          message: `Invalid role name(s) given: ${roleNames.difference(new Set(roles.map(role => role.name)))}`,
        },
      };
    }

    await keycloakApi.addRolesToUser(user.keycloakId, roles);

    return {
      body: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: roles.map(role => role.name),
      },
    };
  }
);