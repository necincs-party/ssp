# SSP API Server
###### 20/5/2017

## Create Device
```javascript
OPTIONS = {
    PATH: '/device',
    METHOD: 'POST'
};

REQUEST = {
    ownerId: ObjectId // Id of user, which want to register the new device
};

RESPONSE = {
  "ownerId": "591e15ab8833a1a3fb82efb3",
  "_id": "592012e3790b020b77b083eb",              // Device id in DataBase
  "trustees": [],                                 // Array of IDs of trustees people for this device
  "history": [],                                  // Array of location history
  "registrationDate": "2017-05-20T09:56:51.935Z"  // UTC date of device registration
};
```

## Push into device's history
```javascript
OPTIONS = {
    PATH: '/device/history',
    METHOD: 'POST'
};

REQUEST = {
    deviceId: ObjectId,        // Id of device to push new fields
    locations: [               // This is an ARRAY of objects
        // ...
        {     
            timestamp: Number, // UTC timestamp of time when device received the cords,
            lon: Number,       // Device longitude (GPS X position)
            lat: Number,       // Device latitude (GPS Y position)
        },
        // ...
    ],
};

RESPONSE = [ // Array of the same location field as was received by the server
    // ...
    {
        "date": "2017-05-20T10:56:26.265Z",  // UTC Date of device deceiving cords
        "_id": "5920210e73cc8916747a8a3d",   // Id of concrete location field 
        "cords": {
            "lat": 380.2872400652093,
            "lon": 210.08867236188888
        }
    }
    // ...
];
```

## Get device location history
```javascript
OPTIONS = {
    PATH: '/device/{{ YOUR_DEVICE_ID }}/history', // this is a template path
    METHOD: 'GET',
    GET_PARAMS: {
        from: Number,  // UTC timestamp of the start of location list
        to: Number     // UTC timestamp of the end of location list
    }
};

RESPONSE = [
    // ...
    {
        "date": "2017-05-20T10:56:26.265Z",  // UTC Date of device deceiving cords
        "_id": "5920210e73cc8916747a8a3d",   // Id of concrete location field 
        "cords": {
            "lat": 380.2872400652093,
            "lon": 210.08867236188888
        }
    }
    // ...
];
```
