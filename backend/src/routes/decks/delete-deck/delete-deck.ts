
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { Prisma, prisma } from 'prisma/client';

type DeleteDeckRequest = RequestData<null, null>;
type DeleteDeckResponse = ResponseData<null>;

export const deleteDeck = endpoint.delete('/:deckId')<DeleteDeckRequest, DeleteDeckResponse>(async data => {
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

  try {
    await prisma.deck.delete({
      where: {id, user: {netId: data.requester.username}},
    });
    return {
      status: 204,
    };
  } catch (err) {
    if(err instanceof Prisma.PrismaClientKnownRequestError){
      if (err.code === 'P2025') {
        return {
          status: 404,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Deck not found',
          },
        };
      }
    }
    throw err;
  }
});