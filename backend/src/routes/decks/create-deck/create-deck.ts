
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { Prisma, prisma } from 'prisma/client';

type CreateDeckRequest = RequestData<null, { name: string; description: string; }>;
type CreateDeckResponse = ResponseData<{ id: number; name: string }>;

export const createDeck = endpoint.post('/')<CreateDeckRequest, CreateDeckResponse>(async data => {
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
  try{
  const newDeck = await prisma.deck.create({
    data: {
      name: data.body.name,
      description: data.body.description,
      user: {
        connect: {
          netId: data.requester.username,
        },
      },
    },
    select: {
      id: true,
      name: true
    }
  });
  
  return {
    body: newDeck,
    status: 200,
  };
}catch(err){
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if(err.code === 'P2025') {
      return {
        status: 404,
        error: {
          code: 'INVALID_REQUEST',
          message: "Requesting user not found",
        },
      };
    }
    if (err.code === 'P2002') {
      return {
        status: 409,
        error: {
          code: 'CONFLICT',
          message: "A deck with this name already exists for the user.",
        },
      };
    }
  }
  throw err;
}
});