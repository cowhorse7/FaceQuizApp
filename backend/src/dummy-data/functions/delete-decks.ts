import { DummyFunction } from "@fhss-web-team/backend-utils/dummy";
import { prisma } from 'prisma/client';

export const deleteDecks: DummyFunction = {
  name: "Delete decks",
  description: "Deletes all decks",
  handler: async () => {
    const {count} = await prisma.deck.deleteMany({});
    return `Deleted ${count} decks`;
  },
};