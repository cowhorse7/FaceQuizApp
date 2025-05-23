
import { RequestData, ResponseData } from '@fhss-web-team/backend-utils/endpoint';
import { endpoint } from '@fhss-web-team/backend-utils/endpoint';

type GetDecksRequest = RequestData<null, null>;
type GetDecksResponse = ResponseData<null>;

export const getDecks = endpoint.get('/')<GetDecksRequest, GetDecksResponse>(data => {
  return {
    error: { message: 'This endpoint has not been implemented yet.' },
    status: 501,
  };
});