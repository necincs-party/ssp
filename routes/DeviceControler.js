const { Device, Users } = require('../models');

const DeviceController = async ctx => {
    const body = ctx.request.body;

    const user = await Users.findOne({ _id: body.ownerId });

    if (user !== null) {
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
    } else {
        ctx.status = 400;
        ctx.body = {
            message: `There are no user with id ${body.ownerId}`,
        }
    }
};

module.exports = DeviceController;