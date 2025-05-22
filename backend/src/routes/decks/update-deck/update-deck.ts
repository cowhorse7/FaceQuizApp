
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

  try {
    const newDeck = await prisma.deck.update({
      where: {id, user: { netId: data.requester.username }},
      data: {
        name: data.body.name,
        description: data.body.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return {
      status: 200,
      body: newDeck,
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
      if (err.code === 'P2002') {
        return {
          status: 409,
          error: {
            code: 'CONFLICT',
            message: 'A deck with this name already exists for the user.',
          },
        };
      }
    }
    throw err;
  }
});