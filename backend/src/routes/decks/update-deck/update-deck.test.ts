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
        using prismaStub = stub(prisma.deck, 'update', () => {
        return Promise.resolve() as unknown as Prisma.Prisma__DeckClient<Deck>;
        });

        const result = await updateDeck.handler({
            requester: null,
            params: { deckId: '1234' },
            query: null,
            body: { description: '' },
        });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/request/i);
        expect(prismaStub.calls).toHaveLength(0);
    });
  
    it("errors if no data", async () => {
        using prismaStub = stub(prisma.deck, 'update', () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result1 = await updateDeck.handler({
            requester: requester,
            params: { deckId: '1234' },
            query: null,
            body: {},
        });

        expect(result1.status).toBe(400);
        expect(result1.error).toBeDefined();
        expect(prismaStub.calls).toHaveLength(0);

        const result2 = await updateDeck.handler({
            requester: requester,
            params: { deckId: '1234' },
            query: null,
            body: { name: '' },
        });
        
        expect(result2.status).toBe(400);
        expect(result2.error).toBeDefined();
        expect(prismaStub.calls).toHaveLength(0);
    });

    it("errors if invalid id", async () => {
        using prismaStub = stub(prisma.deck, "update", () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result = await updateDeck.handler({
            requester: requester,
            params: {deckId: 'asdf'},
            query: null,
            body: {},
        });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
        expect(prismaStub.calls).toHaveLength(0);
    });

    it("returns the id, name, and description", async () => {
        const newDeck = {
            id: 1234,
            name: "NewName",
            description: '',
        };
        using prismaStub = stub(prisma.deck, "update", () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result = await updateDeck.handler({
            requester: requester,
            params: {deckId: '1234'},
            query: null,
            body: { name: "NewName", description: ''},
        });

        expect(result.status).toBe(200);
        expect(result.body).toEqual(newDeck);
        expect(prismaStub.calls).toHaveLength(1);
    });

    it("returns the correct error for deck not found", async () => {
        using prismaStub = stub(prisma.deck, "update", () => {
            throw new Prisma.PrismaClientKnownRequestError("operation failed ... depends on records ... not found", {
                code: 'P2025',
                clientVersion: 'idk bro',
            });
        });
        const result = await updateDeck.handler({
            requester: requester,
            params: { deckId: '1234' },
            body: {description: "hello"},
            query: null,
        });

        expect(result.status).toBe(404);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/deck not found/i);
        expect(prismaStub.calls).toHaveLength(1);
    });

    it("returns correct error for duplicate deck", async () => {
            using prismaStub = stub(prisma.deck, "update", () => {
                throw new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
                    code: 'P2002',
                    clientVersion: 'idk bro',
                });
            });
            const result = await updateDeck.handler({
                requester: requester,
                params: { deckId: '1234'},
                body: {name: "New Deck"},
                query: null,
            });
    
            expect(result.status).toBe(409);
            expect(result.error).toBeDefined();
            expect(result.error?.message).toMatch(/deck/i);
            expect(prismaStub.calls).toHaveLength(1);
        });
})