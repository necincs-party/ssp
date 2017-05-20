const http = require('http');

function getLocationField(timestamp) {
    return {
        timestamp,
        lat: Math.random() * 1000,
        lon: Math.random() * 1000,
    }
}

function generateLocation(items) {
    let timestamps = new Date().getTime();
    let locations = [];

    for (let i = 0; i < items; i += 1) {
        timestamps -= i * 10000;
        locations[i] = getLocationField(timestamps);
    }

    return locations;
}

const requestBody = {
    deviceId: "", // HERE YOU SHOULD PUT DEVICE ID
    locations: generateLocation(100),
};

const options = {
    host: 'localhost',
    port: '8080',
    path: '/device/history',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

function responseHandler(err, res) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('success', res);
    }
}

const req = http.request(options, responseHandler);
req.write(JSON.stringify(requestBody));
req.end();
