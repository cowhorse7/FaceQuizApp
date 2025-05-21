import { expect } from '@std/expect/expect';
import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { createDeck } from './create-deck.ts';
import { Deck, Prisma, prisma } from 'prisma/client';

const requester = {
    roles: [],
    username: 'testNetId',
    firstName: 'Test',
    lastName: 'Deck',
    email: 'testuser@example.com',
}

describe('Create deck', () => {
    it('errors if there is no requesting user', async () => {
        using prismaStub = stub(prisma.deck, 'create', () => {
        return Promise.resolve() as unknown as Prisma.Prisma__DeckClient<Deck>;
      });

        const result = await createDeck.handler({
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
        const result = await createDeck.handler({
            requester,
            params: {},
            query: null,
            body: null,
        });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/name/i);
        expect(prismaStub.calls).toHaveLength(0);
    });
});