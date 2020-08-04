const utils = require('../src/utils');
const { NotFoundError } = require('../src/errors');

describe('db return ohm', () => {
    test('returns Ohm object', async () => {
        const ohm = await utils.getOhmById('1')
        expect(ohm).toBeDefined();
    });

    test('has a valid history', async () => {
        const ohm = await utils.getOhmById('1');
        const statuses = [ 'CREATED', 'PREPARING', 'READY', 'IN_DELIVERY','DELIVERED', 'REFUSED']
        const isValidStatus = statuses.includes(ohm.history[0].state)
        expect(isValidStatus).toBe(true);
    });

    test('cannot get non-existant ohm id', async () => {
        expect.assertions(1);
        return utils.getOhmById('99').catch((e) => {
            console.log('OK');
            expect(e.statusCode).toEqual(404);
        })
    });

    test('get by tracking id', async () => {
        const ohm = await utils.getOhmByTrackingId('1e62adfe');
        expect(ohm).toBeDefined();
    });

    test('cannot get non-existant tracking id', async () => {
        expect.assertions(1);
        return utils.getOhmByTrackingId('randomrandom').catch((e) => {
            console.log('OK');
            expect(e.statusCode).toEqual(404);
        })
    });
});

// describe('error on wrong ohm id', () => {
//     test('throws when getting wrong ohm id', () => {
//         expect(Utils.getOhmById('99').toThrow())
//     })
// });

// describe('testing ')