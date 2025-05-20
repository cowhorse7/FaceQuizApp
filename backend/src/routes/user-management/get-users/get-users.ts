import { endpoint, RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { SortDirection, SortProperty } from '../../../services/user/user.types.ts';
import { ByuAccountType } from 'prisma/client';
import { userService } from '../../../services/user/user.ts';
import { keycloakApi } from '@fhss-web-team/backend-utils/apis';

type GetUsersRequest = RequestData<
  {
    search?: string;
    account_types?: string;
    created_after?: string;
    created_before?: string;
    sort_by?: SortProperty;
    sort_direction?: SortDirection;
    page_count?: string;
    page_offset?: string;
  },
  null
>;
type GetUsersResponse = ResponseData<
{
  totalCount: number,
  data: {
    id: string;
    netId: string;
    accountType: string;
    preferredFirstName: string;
    preferredLastName: string;
    roles: string[];
    created: string;
  }[]
}  
>;

export const getUsers = endpoint.get('/')<GetUsersRequest, GetUsersResponse>(async data => {
  // Checks input account type
  let acctTypes;
  if (data.query?.account_types) {
    try {
      const typeStrings: string[] | undefined = data.query?.account_types
        ? data.query.account_types.split(',')
        : undefined;
      acctTypes = typeStrings?.map(typeString => {
        const type = Object.values(ByuAccountType).find(type => type.toLowerCase() === typeString.toLowerCase());
        if (!type) throw new Error(`Account type '${typeString}' does not exist`);
        return type;
      });
    } catch (err) {
      return {
        error: {
          code: 'INVALID_REQUEST',
          message: (err as Error).message,
        },
        status: 400,
      };
    }
  }

  // Checks input dates
  const created_after = data.query?.created_after ? new Date(data.query?.created_after) : undefined;
  const created_before = data.query?.created_before ? new Date(data.query?.created_before) : undefined;
  if ((created_after && isNaN(created_after.valueOf())) || (created_before && isNaN(created_before.valueOf()))) {
    return {
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid date given',
      },
      status: 400,
    };
  }

  // Checks input sort parameters
  if (data.query?.sort_direction && !data.query.sort_by) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `If 'sort_direction' is provided in request, 'sort_by' must also be specified`,
      },
    };
  }
  const canSortBy = ['netId', 'accountType', 'preferredFirstName', 'preferredLastName', 'created'];
  if (!canSortBy.includes(data.query?.sort_by ?? 'err')) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid sort property: ${data.query?.sort_by}`,
      },
    };
  }
  if (data.query?.sort_direction && !(data.query.sort_direction === 'asc' || data.query.sort_direction === 'desc')) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid sort direction: ${data.query?.sort_direction}`,
      },
    };
  }

  // Checks input pagination parameters
  const count = data.query?.page_count ? parseInt(data.query?.page_count, 10) : undefined;
  const offset = data.query?.page_offset ? parseInt(data.query?.page_offset, 10) : undefined;
  if (count !== undefined && isNaN(count)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid pagination count input: '${data.query?.page_count}'`,
      },
    };
  }
  if (offset !== undefined && isNaN(offset)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid pagination offset input: '${data.query?.page_offset}'`,
      },
    };
  }

  // Get the total count of users
  const totalCount = await userService.getUsersCount({
    filter: {
      search: data.query?.search,
      accountTypes: acctTypes,
      createdAt: {
        start: created_after,
        end: created_before,
      },
    }
  })

  // Gets user data
  const users = await userService.getUsers({
    paginate: { count, offset },
    filter: {
      search: data.query?.search,
      accountTypes: acctTypes,
      createdAt: {
        start: created_after,
        end: created_before,
      },
    },
    sort: {
      property: data.query?.sort_by,
      direction: data.query?.sort_direction
    },
  });

  // Formats user data and requests keycloak roles
  const userData = users.map(async user => ({
    id: user.id,
    netId: user.netId,
    accountType: user.accountType,
    preferredFirstName: user.preferredFirstName,
    preferredLastName: user.preferredLastName,
    created: user.createdAt.toISOString(),
    roles: (await keycloakApi.getUserAppRoles(user.keycloakId)).map(role => role.name),
  }));

  // Finishes all requests and returns formatted data
  return {
    body: {
      totalCount,
      data: await Promise.all(userData),
    }
  };
});