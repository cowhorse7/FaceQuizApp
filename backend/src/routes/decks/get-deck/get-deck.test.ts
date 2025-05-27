import { expect } from '@std/expect/expect';
import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { getDeck } from './get-deck.ts';
import { prisma, Prisma, Deck } from 'prisma/client';
import { fileService } from '@fhss-web-team/backend-utils/services';

const requester = {
    roles: [],
    username: 'testNetId',
    firstName: 'Test',
    lastName: 'Deck',
    email: 'testuser@example.com',
};

describe('Get deck', () => {
    const deck = {
        name: 'Deck one',
        description: "A sample desc for Deck One",
        id: 1,
        cards: [
            { id: 12, personName: "alejandro Ga", personDepartment: 'psychadelic', imageName: 'image.jpg'},
            { id: 45, personName: "America Sans", personDepartment: 'cs', imageName: 'photo.png'},
            { id: 62, personName: "Freddy Mercury", personDepartment: 'math', imageName: 'picture.jpg'},
        ]
    }
    const deckRes = {
        name: 'Deck one',
        description: "A sample desc for Deck One",
        id: 1,
        cards: [
            { id: 12, personName: "alejandro Ga", personDepartment: 'psychadelic', imageUrl: 'https://somewebsite.com'},
            { id: 45, personName: "America Sans", personDepartment: 'cs', imageUrl: 'https://somewebsite.com'},
            { id: 62, personName: "Freddy Mercury", personDepartment: 'math', imageUrl: 'https://somewebsite.com'},
        ]
    }

    it('errors if there is no requesting user', async () => {
        using prismaStub = stub(prisma.deck, 'findUnique', () => {
            return Promise.resolve() as unknown as Prisma.Prisma__DeckClient<Deck>;
        });

        const result = await getDeck.handler({
            requester: null,
            params: { deckId: ''},
            query: null,
            body: null,
        });

        expect(result.status).toBe(400);
        expect(result.error?.message).toMatch(/request/i);
        expect(prismaStub.calls).toHaveLength(0);
    });

    it("errors if invalid id", async () => {
        using prismaStub = stub(prisma.deck, 'findUnique', () => {
            return Promise.resolve(null) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result = await getDeck.handler({
            requester: requester,
            params: { deckId: 'asdf'},
            query: null,
            body: null,
        });
    
        expect(result.status).toBe(400);
        expect(result.error?.message).toMatch(/id/i);
        expect(prismaStub.calls).toHaveLength(0);
    });

    it("returns the correct error for deck not found", async () => {
        using prismaStub = stub(prisma.deck, "findUnique", () => {
            return Promise.resolve(null) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        const result = await getDeck.handler({
            requester: requester,
            params: { deckId: '1234'},
            body: null,
            query: null,
        });
    
        expect(result.status).toBe(404);
        expect(result.error).toBeDefined();
        expect(result.error?.message).toMatch(/deck/i);
        expect(prismaStub.calls).toHaveLength(1);
    });

    it("returns the correct deck and cards", async () => {
        using prismaStub = stub(prisma.deck, "findUnique", () => {
            return Promise.resolve(deck) as unknown as Prisma.Prisma__DeckClient<Deck>;
        });
        using minioStub = stub(fileService, 'getUrl', () => {
            return Promise.resolve("https://somewebsite.com");
        });

        const result = await getDeck.handler({
            requester: requester,
            params: {deckId: '1'},
            body: null,
            query: null,
        });

        expect(result.body).toMatchObject(deckRes);
        expect(prismaStub.calls).toHaveLength(1);
        expect(minioStub.calls).toHaveLength(deckRes.cards.length)
    });
})