
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { prisma } from 'prisma/client';
import { fileService } from '@fhss-web-team/backend-utils/services';

type GetDeckRequest = RequestData<null, null>;
type GetDeckResponse = ResponseData<{
  id: number;
  name: string;
  description: string;
  cards: {
    id: number;
    personName: string;
    personDepartment: string;
    imageUrl: string | null;
  }[];
}>;

export const getDeck = endpoint.get('/:deckId')<GetDeckRequest, GetDeckResponse>(async data => {
  if (!data.requester) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: 'No requesting user',
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

  const deck = await prisma.deck.findUnique({
    where: {id, user: {netId: data.requester.username}},
    select: {
      id: true,
      name: true,
      description: true,
      cards: {
        select: {
          id: true,
          personName: true,
          personDepartment: true,
          imageName: true,
        },
      },
    },
  })
  if (!deck) {
    return {
      status: 404,
      error: {
        code: 'NOT_FOUND',
        message: "Deck not found",
      },
    };
  }

  const cards = await Promise.all(
    deck.cards.map(async cardData => ({
      id: cardData.id,
      personName: cardData.personName,
      personDepartment: cardData.personDepartment,
      imageUrl: await fileService.getUrl(cardData.imageName),
    })),
  );

  return {
    body: {
      ...deck,
      cards,
    },
  };
});