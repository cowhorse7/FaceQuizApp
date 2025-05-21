import { DummyFunction } from "@fhss-web-team/backend-utils/dummy";
import { Prisma, prisma } from 'prisma/client';
import { faker } from '@faker-js/faker';

export const createDecks: DummyFunction<{ count: number; netId: string }> = {
  name: "Create decks",
  description: "Creates a number of decks for a given user",
  inputLabels: { count: 'The number of decks to generate', netId: 'The netId of the owner of the decks' },
  handler: async data => {
    const user = await prisma.user.findUnique({where: {netId: data.netId ?? ''}});
    if (!user) {
      throw new Error("User not found");
    }

    const decks: Prisma.DeckCreateManyInput[] = Array.from({length: Math.abs(data.count ?? 10)}, () => ({
      name: faker.book.title(),
      userId: user.id,
    }));

    const {count} = await prisma.deck.createMany({data: decks});
    return `Created ${count} decks`;
  },
};