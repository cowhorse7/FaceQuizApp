
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { Prisma, prisma } from 'prisma/client';

type DeleteDeckRequest = RequestData<null, null>;
type DeleteDeckResponse = ResponseData<null>;

export const deleteDeck = endpoint.delete('/:deckId')<DeleteDeckRequest, DeleteDeckResponse>(data => {
  if(!data.requester) {
    return {
      status: 400,
      error: {
        code: "INVALID_REQUEST",
        message: "No requesting user",
      },
    };
  }
  const id = parseInt(data.params.deckId);
  if (isNaN(id)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid deck ID',
      },
    };
  }
  return {
    error: { message: 'This endpoint has not been implemented yet.' },
    status: 501,
  };
});