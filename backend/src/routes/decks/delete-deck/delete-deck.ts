
import { RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { endpoint } from '@fhss-web-team/backend-utils/endpoint';

type DeleteDeckRequest = RequestData<null, { name: string; }>;
type DeleteDeckResponse = ResponseData<null>;

export const deleteDeck = endpoint.post('/')<DeleteDeckRequest, DeleteDeckResponse>(data => {
  if(!data.requester) {
    return {
      status: 400,
      error: {
        code: "INVALID_REQUEST",
        message: "No requesting user",
      },
    };
  }
  if(!data.body?.name) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: "Deck name required",
      },
    };
  }
  return {
    error: { message: 'This endpoint has not been implemented yet.' },
    status: 501,
  };
});