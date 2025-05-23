
import { RequestData, ResponseData, endpoint } from '@fhss-web-team/backend-utils/endpoint';
import { prisma } from 'prisma/client';

type GetDecksRequest = RequestData<{
  sort_by: string;
  sort_direction: string;
  page_count: string;
  page_offset: string;
  filter_name: string;
}, null>;
type GetDecksResponse = ResponseData<{
  data: {
    id: number;
    name: string;
    description: string;
    size: number;
  }[];
  totalCount: number;
}>;

export const getDecks = endpoint.get('/')<GetDecksRequest, GetDecksResponse>(async data => {
  if (!data.requester) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: 'No requesting user',
      },
    };
  }
  
  const take = data.query?.page_count ? parseInt(data.query.page_count) : 10;
  const skip = data.query?.page_offset ? parseInt(data.query.page_offset): 0;

  if(isNaN(take)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid pagination count input: '${data.query?.page_count}'`,
      },
    };
  }
  if(isNaN(skip)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid page offset input: '${data.query?.page_offset}'`,
      },
    };
  }
  if(data.query?.sort_direction && !data.query.sort_by) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `If 'sort_direction' is provided, 'sort_by' must also be specified`,
      },
    };
  }

  const sortDir = data.query?.sort_direction ?? 'desc';
  if(sortDir !== 'asc' && sortDir !== 'desc') {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid sort direction: '${data.query?.sort_direction}'`,
      },
    };
  }

  const sortBy = data.query?.sort_by ?? 'updatedAt';
  const canSortBy = ['name', 'count', 'updatedAt', 'createdAt'];
  if(!canSortBy.includes(sortBy)) {
    return {
      status: 400,
      error: {
        code: 'INVALID_REQUEST',
        message: `Invalid sort property: '${data.query?.sort_by}'`,
      },
    }
  }

  const orderBy = { [sortBy]: sortBy !== 'cards' ? sortDir : {_count: sortDir}};

  const decks = await prisma.deck.findMany({
    where: {
      user: {netId: data.requester?.username},
      name: { contains: data.query?.filter_name},
    },
    orderBy,
    skip,
    take,
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          cards: true,
        },
      },
    },
  });

  const totalDeckCount = await prisma.deck.count({
    where: {
      user: { netId: data.requester?.username},
      name: { contains: data.query?.filter_name},
    },
  });

  return {
    body: {
      totalCount: totalDeckCount,
      data: decks.map(deck => ({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        size: deck._count.cards,
      })),
    },
  };
});