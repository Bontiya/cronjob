const mongoose = require("mongoose");
const uriDB = `mongodb+srv://xxx:xxx@cluster0-x8shq.gcp.mongodb.net/bontiya_development?retryWrites=true&w=majority`;
const configDB = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(uriDB, configDB);

require('./Member')
require('./User')
const Event = require('./Event');

const client = require("socket.io-client");
const socket = client.connect("http://localhost:3000");

const CronJob = require('cron').CronJob;
// '0 */01 * * * *'
const job = new CronJob('*/2 * * * * *', function() {
    let getEventPromise = []

    Event
        .find({
            status: 'onGoing'
        })
        .then(res => {
            const { promiseUpdateEvent, idEvents } = createPromise(res)
            getEventPromise = idEvents
            return Promise.all( promiseUpdateEvent )
        })
        .then(res => {
            return Promise.all( getEventPromise )
        })
        .then(res => {
            console.log(res)
            getEventPromise = []
            res.forEach(val => {
                val.members.forEach(member => {
                    socket.emit('updatedStatusEventToDone', member.user._id)
                })
            })
        })
        .catch(console.log)



    const createPromise = (data) => {
        const dateNow = new Date().getTime()
        const prmse = []
        const idEvents = []
        data.forEach(val => {
            if (val.status === 'onGoing') {
                const dateEvent = new Date(val.time).getTime()
                const decreaseDate = dateNow - dateEvent
                if (decreaseDate > 3600000) {
                    prmse.push(
                        Event
                            .updateOne({ _id: val._id }, {
                                status: "done"
                            })
                    )
                    idEvents.push(
                        Event
                            .findById(val._id)
                            .populate({
                                path: 'members',
                                populate: {
                                    path: 'user'
                                },
                                match: {
                                    statusInvited: {
                                      $not: {
                                        $eq: "refused"
                                      }
                                    }
                                }
                            })
                    )
                }
                // if (dateNow > dateEvent) {
                //     prmse.push(
                //         Event
                //             .updateOne({ _id: val._id }, {
                //                 status: "done"
                //             })
                //     )
                //     idEvents.push(val._id)
                // }
            }
        });
        return {
            promiseUpdateEvent: prmse,
            idEvents
        }
    }













}, null, true, "Asia/Jakarta");
job.start();

// const updateEventToDone = async () => {
//     try {

//         const { data } = await Event
//                                 .find()
//         console.log(data)
//     } catch (error) {
//         console.log(error, 'sa')
//     }
// }
