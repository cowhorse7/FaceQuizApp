import { expect } from '@std/expect/expect';
import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { updateDeck } from './update-deck.ts';
import { Deck, Prisma, prisma } from 'prisma/client';

const requester = {
    roles: [],
    username: 'testNetId',
    firstName: 'Test',
    lastName: 'Deck',
    email: 'testuser@example.com',
}

describe('Update deck', () => {
  it('errors if there is no requesting user', async () => {
          using prismaStub = stub(prisma.deck, 'create', () => {
          return Promise.resolve() as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
  
          const result = await updateDeck.handler({
              requester: null,
              params: {},
              query: null,
              body: null,
          });
  
          expect(result.status).toBe(400);
          expect(result.error).toBeDefined();
          expect(result.error?.message).toMatch(/user/i);
          expect(prismaStub.calls).toHaveLength(0);
      });
  
    it("errors if name is missing", async () => {
        using prismaStub = stub(prisma.deck, 'create', () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result = await updateDeck.handler({
            requester: requester,
            params: {},
            query: null,
            body: null,
        });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/name/i);
        expect(prismaStub.calls).toHaveLength(0);
    });

    it("returns the correct error for user not found", async () => {
            using prismaStub = stub(prisma.deck, "create", () => {
                throw new Prisma.PrismaClientKnownRequestError("operation failed ... depends on records ... not found", {
                    code: 'P2025',
                    clientVersion: 'idk bro',
                });
            });
            const result = await updateDeck.handler({
                requester: requester,
                params: {},
                body: {name: "New Deck"},
                query: null,
            });
    
            expect(result.status).toBe(404);
            expect(result.error).toBeDefined();
            expect(result.error?.message).toMatch(/user not found/i);
            expect(prismaStub.calls).toHaveLength(1);
        });
})