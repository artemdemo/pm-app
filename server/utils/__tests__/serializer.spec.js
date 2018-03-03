const serializer = require('../serializer');

describe('Serialize strings to object', () => {
    it('1 property - array of objects', () => {
        const data = [
            {
                name: 'priority[0]name',
                value: 'name-0',
            },
            {
                name: 'priority[1]name',
                value: 'name-1',
            },
            {
                name: 'priority[1]value',
                value: 'value-1',
            },
            {
                name: 'priority[0]value',
                value: 'value-0',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.priority.length).toBe(2);
        expect(result.priority[0].name).toBe('name-0');
        expect(result.priority[0].value).toBe('value-0');
        expect(result.priority[1].name).toBe('name-1');
        expect(result.priority[1].value).toBe('value-1');
    });

    it('2 properties - objects', () => {
        const data = [
            {
                name: 'obj{}name',
                value: 'name property',
            },
            {
                name: 'another_obj{}title',
                value: 'title property',
            },
            {
                name: 'another_obj{}anonimus',
                value: 'anonimus property',
            },
            {
                name: 'obj{}description',
                value: 'description property',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.obj.name).toBe('name property');
        expect(result.obj.description).toBe('description property');
        expect(result.another_obj.title).toBe('title property');
        expect(result.another_obj.anonimus).toBe('anonimus property');
    });

    it('2 properties - 1 object and 1 string', () => {
        const data = [
            {
                name: 'obj{}name',
                value: 'name property',
            },
            {
                name: 'str_prop',
                value: 'string property',
            },
            {
                name: 'obj{}description',
                value: 'description property',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.obj.name).toBe('name property');
        expect(result.obj.description).toBe('description property');
        expect(result.str_prop).toBe('string property');
    });

    it('nested objects', () => {
        const data = [
            {
                name: 'obj{}name',
                value: 'name property',
            },
            {
                name: 'obj{}description',
                value: 'description property',
            },
            {
                name: 'obj{}nested{}title',
                value: 'nested title',
            },
            {
                name: 'obj{}nested{}info',
                value: 'nested info',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.obj.name).toBe('name property');
        expect(result.obj.description).toBe('description property');
        expect(result.obj.nested.title).toBe('nested title');
        expect(result.obj.nested.info).toBe('nested info');
    });

    it('array nested in object', () => {
        const data = [
            {
                name: 'obj{}name',
                value: 'name property',
            },
            {
                name: 'obj{}arr[0]title',
                value: 'nested arr title - 0',
            },
            {
                name: 'obj{}arr[0]info',
                value: 'nested arr info - 0',
            },
            {
                name: 'obj{}arr[1]title',
                value: 'nested arr title - 1',
            },
            {
                name: 'obj{}arr[1]info',
                value: 'nested arr info - 1',
            },
            {
                name: 'obj{}description',
                value: 'description property',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.obj.name).toBe('name property');
        expect(result.obj.description).toBe('description property');
        expect(result.obj.arr.length).toBe(2);
        expect(result.obj.arr[0].title).toBe('nested arr title - 0');
        expect(result.obj.arr[0].info).toBe('nested arr info - 0');
        expect(result.obj.arr[1].title).toBe('nested arr title - 1');
        expect(result.obj.arr[1].info).toBe('nested arr info - 1');
    });

    it('array nested in object', () => {
        const data = [
            {
                name: 'obj{}name',
                value: 'name property',
            },
            {
                name: 'obj{}description',
                value: 'description property',
            },
            {
                name: 'obj{}arr[]',
                value: 'value-0',
            },
            {
                name: 'obj{}arr[]',
                value: 'value-1',
            },
        ];
        const result = serializer.strArrToObj(data);

        expect(result.obj.name).toBe('name property');
        expect(result.obj.description).toBe('description property');
        expect(result.obj.arr.length).toBe(2);
        expect(result.obj.arr[0]).toBe('value-0');
        expect(result.obj.arr[1]).toBe('value-1');
    });
});

describe('Object to strings', () => {
    it('Simple object', () => {
        const data = {
            priority: 'high',
            data: 'some data',
        };
        const result = serializer.objToStrArr(data);

        expect(result.length).toBe(2);
        expect(result[0].name).toBe('priority');
        expect(result[0].value).toBe('high');
        expect(result[1].name).toBe('data');
        expect(result[1].value).toBe('some data');
    });

    it('Array of objects', () => {
        const data = {
            priority: [
                {
                    name: 'name-0',
                    value: 'value-0',
                },
                {
                    name: 'name-1',
                    value: 'value-1',
                },
            ],
        };
        const result = serializer.objToStrArr(data);

        expect(result.length).toBe(4);
        expect(result[0].name).toBe('priority[0]name');
        expect(result[0].value).toBe('name-0');
        expect(result[1].name).toBe('priority[0]value');
        expect(result[1].value).toBe('value-0');
        expect(result[2].name).toBe('priority[1]name');
        expect(result[2].value).toBe('name-1');
        expect(result[3].name).toBe('priority[1]value');
        expect(result[3].value).toBe('value-1');
    });

    it('Nested objects', () => {
        const data = {
            obj: {
                name: 'name property',
                nested: {
                    title: 'title property',
                    descr: 'description property',
                },
            },
        };
        const result = serializer.objToStrArr(data);

        expect(result.length).toBe(3);
        expect(result[0].name).toBe('obj{}name');
        expect(result[0].value).toBe('name property');
        expect(result[1].name).toBe('obj{}nested{}title');
        expect(result[1].value).toBe('title property');
        expect(result[2].name).toBe('obj{}nested{}descr');
        expect(result[2].value).toBe('description property');
    });
});

describe('Object <-> Array', () => {
    it('Test convertion in both directions', () => {
        const data = {
            obj: {
                name: 'name property',
                nested: {
                    title: 'title property',
                    descr: 'description property',
                },
                arr: [
                    'val-0',
                    'val-1',
                    'val-2',
                ],
            },
        };
        const arrResult = serializer.objToStrArr(data);
        const objResult = serializer.strArrToObj(arrResult);

        expect(objResult.obj.name).toBe('name property');
        expect(objResult.obj.nested.title).toBe('title property');
        expect(objResult.obj.nested.descr).toBe('description property');
        expect(objResult.obj.arr.length).toBe(3);
        expect(objResult.obj.arr[0]).toBe('val-0');
        expect(objResult.obj.arr[1]).toBe('val-1');
        expect(objResult.obj.arr[2]).toBe('val-2');
    });
});
