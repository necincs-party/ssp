const { Device, Users } = require('../models');
const validateBody = require('../lib/bodyValidator');

class DeviceController {
    static get types() {
        return {
            create: {
                ownerId: String,
            },
            pushHistory: {
                deviceId: String,
                locations: [{
                    timestamp: Number,
                    lat: Number,
                    lon: Number,
                }],
            },
        };
    }

    /**
     * Create new device
     * body: {
     *      ownerId: ObjectId,
     * }
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        const { body } = ctx.request;

        const user = await Users.findOne({ _id: body.ownerId });

        if (user === null) {
            ctx.status = 400;
            ctx.body = {
                message: `There are no user with id ${body.ownerId}`,
            }
        } else {
            const newDevice = new Device({
                ownerId: user._id,
            });

            const error = newDevice.validateSync();
            if (error) {
                ctx.body = error;
            } else {
                await newDevice.save((err, res) => {
                    if (err) {
                        ctx.body = err;
                    } else {
                        ctx.body = res;
                    }
                });
            }
        }
    }

    /**
     * Push item in device location history
     * body: {
     *      deviceId: ObjectId,
     *      locations: [{
     *          lat: Number,
     *          lon: Number,
     *          timestamp: Number,
     *      }],
     * }
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async pushHistory(ctx) {
        const { body } = ctx.request;

        const valid = await validateBody(body, DeviceController.types.pushHistory);

        if (valid === false) {
            ctx.status = 400;
            ctx.body = {
                message: 'Request body is not valid',
            };
            return;
        }

        const device = await Device.findById(body.deviceId);

        if (device === null) {
            ctx.status = 400;
            ctx.body = {
                message: `There is no registered device with id ${body.deviceId}`,
            };
            return;
        }

        const history = body.locations.map(location => ({
            date: new Date(location.timestamp),
            coords: {
                lat: location.lat,
                lon: location.lon,
            },
        }));

        device.history = [...history, ...device.history];

        // todo: add mongoose validation step as well
        await device.save((err, updatedDevice) => {
           if (err) {
               ctx.status = 500;
               ctx.body = err;
           } else {
               ctx.body = updatedDevice.history.slice(0, history.length);
           }
        });
    }
}

module.exports = DeviceController;