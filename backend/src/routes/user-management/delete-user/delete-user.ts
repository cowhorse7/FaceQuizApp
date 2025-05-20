import { endpoint, RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { Prisma } from 'prisma/client';
import { userService } from '../../../services/user/user.ts';

type DeleteUserRequest = RequestData<null, null>;
type DeleteUserResponse = ResponseData<null>;

export const deleteUser = endpoint.delete('/:userId')<DeleteUserRequest, DeleteUserResponse>(async data => {
  try {
    await userService.deleteUser(data.params.userId);
    return { status: 204 };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2015') {
      return {
        error: { code: 'NOT_FOUND' },
        status: 404,
      };
    }
    throw err;
  }
});