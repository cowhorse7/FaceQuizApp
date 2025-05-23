import { expect } from '@std/expect/expect';
import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { getDecks } from './get-decks.ts';
import { prisma, Prisma, Deck } from 'prisma/client';

const requester = {
    roles: [],
    username: 'testNetId',
    firstName: 'Test',
    lastName: 'Deck',
    email: 'testuser@example.com',
};

describe('Get decks', () => {
    const decks = [
        {
            name: 'Deck one',
            description: "A sample desc for Deck One",
            id: 1,
            _count: {
                cards: 3,
            },
        },
        {
            name: 'Deck Two',
            description: 'Another sample description',
            id: 2,
            _count: {
                cards: 5,
            },
        },
        {
            name: 'Deck Three',
            description: 'This is Deck Three, with fewer cards',
            id: 3,
            _count: {
                cards: 2,
            },
        },
        {
            name: 'Deck Four',
            description: 'Deck Four has quite a few cards',
            id: 4,
            _count: {
                cards: 8,
            },
        },
        {
            name: 'Deck Five',
            description: 'A very small deck for testing',
            id: 5,
            _count: {
                cards: 1,
            },
        },
    ];

    it('errors if there is no requesting user', async () => {
        using prismaStub = stub(prisma.deck, 'findMany', () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck[]>;
        });
        using prismaCountStub = stub(prisma.deck, 'count', () => {
            return Promise.resolve(3) as unknown as Prisma.Prisma__DeckClient<number>;
        });

        const result = await getDecks.handler({
            requester: null,
            params: {},
            query: null,
            body: null,
        });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/request/i);
        expect(prismaStub.calls).toHaveLength(0);
        expect(prismaCountStub.calls).toHaveLength(0);
    });
    
    it("returns empty if db is empty", async () => {
        using prismaStub = stub(prisma.deck, 'findMany', () => {
            return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck[]>;
        });
        using prismaCountStub = stub(prisma.deck, 'count', () => {
            return Promise.resolve(3) as unknown as Prisma.Prisma__DeckClient<number>;
        });

        const result = await getDecks.handler({
            requester: requester,
            params: {},
            query: null,
            body: null,
        });

        expect(result.body?.data.length).toBe(0);
        expect(prismaStub.calls).toHaveLength(1);
        expect(prismaCountStub.calls).toHaveLength(1);
    });

    it("is successful", async () => {
        using prismaStub = stub(prisma.deck, 'findMany', () => {
            return Promise.resolve(decks) as unknown as Prisma.Prisma__DeckClient<Deck[]>;
        });
        using prismaCountStub = stub(prisma.deck, 'count', () => {
            return Promise.resolve(3) as unknown as Prisma.Prisma__DeckClient<number>;
        });

        const result = await getDecks.handler({
            requester: requester,
            params: {},
            query: null,
            body: null,
        });

        expect(result.body).toBeDefined();
        expect(result.body?.data.length).toBe(decks.length);
        expect(result.body?.data).toContainEqual({
            name: decks[0].name,
            description: decks[0].description,
            id: decks[0].id,
            size: decks[0]._count.cards,
        });
        expect(prismaStub.calls).toHaveLength(1);
        expect(prismaCountStub.calls).toHaveLength(1);
    });

    it("correctly parses incorrect query parameters", async () => {
        using prismaStub = stub(prisma.deck, "findMany", () => {
            return Promise.resolve(decks) as unknown as Prisma.Prisma__DeckClient<Deck[]>;
        });
        using prismaCountStub = stub(prisma.deck, "count", () => {
            return Promise.resolve(3) as unknown as Prisma.Prisma__DeckClient<number>;
        });

        const result1 = await getDecks.handler({
            params: {},
            query: {
                sort_by: 'name',
                sort_direction: 'up',
            },
            body: null,
            requester: requester,
        });

        expect(result1.status).toBe(400);
        expect(result1.body).toBeUndefined();
        expect(prismaStub.calls).toHaveLength(0);
        expect(prismaCountStub.calls).toHaveLength(0);

        const result2 = await getDecks.handler({
            params: {},
            query: {
                sort_by: 'color',
            },
            body: null,
            requester: requester,
        });

        expect(result2.status).toBe(400);
        expect(result2.body).toBeUndefined();
        expect(prismaStub.calls).toHaveLength(0);
        expect(prismaCountStub.calls).toHaveLength(0);
    });
});

//const cards = await Promise.all();
// Stuff for single deck-getting
// it("errors if invalid id", async () => {
    // using prismaStub = stub(prisma.deck, 'findMany', () => {
    //     return Promise.resolve([]) as unknown as Prisma.Prisma__DeckClient<Deck[]>;
    // });
    // using prismaCountStub = stub(prisma.deck, 'count', () => {
    //     return Promise.resolve(3) as unknown as Prisma.Prisma__DeckClient<number>;
    // });
//     const result = await getDecks.handler({
//         requester: requester,
//         params: { deckId: 'asdf'},
//         query: {},
//         body: null,
//     });

//     expect(result.status).toBe(400);
//     expect(result.error).toBeDefined();
//     expect(prismaStub.calls).toHaveLength(0);
// });

// it("returns the correct error for deck not found", async () => {
//     using prismaStub = stub(prisma.deck, "delete", () => {
//         throw new Prisma.PrismaClientKnownRequestError("operation failed ... depends on records ... not found", {
//             code: 'P2025',
//             clientVersion: 'idk bro',
//         });
//     });
//     const result = await getDecks.handler({
//         requester: requester,
//         params: { deckId: '1234'},
//         body: null,
//         query: {},
//     });

//     expect(result.status).toBe(404);
//     expect(result.error).toBeDefined();
//     expect(result.error?.message).toMatch(/deck not found/i);
//     expect(prismaStub.calls).toHaveLength(1);
// });