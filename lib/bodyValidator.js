/**
 * Is body match the request schema helper
 * @param body
 * @param schema
 * @returns {Promise.<boolean>}
 */
async function validateBody(body, schema) {
    for (let key in schema) {
        let schemaVal = schema[key];
        let bodyVal = body[key];

        if (Array.isArray(schemaVal)) {
            for (let item of bodyVal) {
                if (await validateBody(item, schemaVal[0]) === false) {
                    return false;
                }
            }
        } else if (typeof schemaVal === 'object') {

            if (await validateBody(bodyVal, schemaVal) === false) {
                return false;
            }
        } else {

            const conditions = [
                bodyVal !== undefined,
                typeof bodyVal === typeof schemaVal(),
                Array.isArray(bodyVal) === Array.isArray(schemaVal()),
            ];


            if (conditions.every(c => c) === false) {
                return false;
            }
        }
    }

    return true;
}

// todo: split this code into the test file
const tests = [
    {
        expects: false,
        body: {
            deviceId: 123,
            locations: 'some string'
        }
    },
    {
        expects: false,
        body: {
            deviceId: 'string',
            locations: 'some string'
        }
    },
    {
        expects: false,
        body: {
            deviceId: 123,
            locations: []
        }
    },
    {
        expects: true,
        body: {
            deviceId: 'some string with id',
            locations: []
        }
    },
    {
        expects: false,
        body: {
            deviceId: 'some string with id',
            locations: [{
                timestamp: 123,
                lon: 123,
                lat: 'str',
            }]
        }
    },
    {
        expects: false,
        body: {
            deviceId: 'some string with id',
            locations: [{
                timestamp: 'some string with timestamp',
                lon: 123,
            }]
        }
    },
    {
        expects: true,
        body: {
            deviceId: 'some string with id',
            locations: [{
                timestamp: 'some timestamp',
                lon: 123,
                lat: 123,
            }]
        }
    },
];

const schema = {
    deviceId: String,
    locations: [{
        timestamp: Date,
        lat: Number,
        lon: Number,
    }],
};
async function s() {
    for (let testSuite of tests) {
        let testResult = await validateBody(testSuite.body, schema);
        if (testResult !== testSuite.expects) {
            console.log(`Error: for ${JSON.stringify(testSuite.body)} expects ${testSuite.expects}, but got ${testResult}`);
        }
    }
}
// s();

module.exports = validateBody;