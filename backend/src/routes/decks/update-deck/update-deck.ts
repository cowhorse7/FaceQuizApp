
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { Prisma, prisma } from 'prisma/client';

type UpdateDeckRequest = RequestData<null, { name: string; description: string; }>;
type UpdateDeckResponse = ResponseData<{ id: number; name: string; description?: string; }>;

export const updateDeck = endpoint.put('/:deckId')<UpdateDeckRequest, UpdateDeckResponse>(async data => {
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
        message: "Invalid deck ID",
      },
    };
  }
  if(!data.body?.name && data.body?.description === undefined) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: "No new data sent",
      },
    };
  }

  return {
    error: { message: 'This endpoint has not been implemented yet.' },
    status: 501,
  };
});