
import { RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { endpoint } from '@fhss-web-team/backend-utils/endpoint';

type CreateDeckRequest = RequestData<null, { name: string; description: string; }>;
type CreateDeckResponse = ResponseData<{ id: number; name: string }>;

export const createDeck = endpoint.post('/')<CreateDeckRequest, CreateDeckResponse>(data => {
  if(!data.requester) {
    return {
      status: 400,
      error: {
        code: "INVALID_REQUEST",
        message: "No requesting user",
      },
    };
  }
  return {
    error: { message: 'This endpoint has not been implemented yet.' },
    status: 501,
  };
});