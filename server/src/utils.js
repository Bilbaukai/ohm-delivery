const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');
const { BadRequestError, NotFoundError } = require('./errors');

const trackingStatuses = ['CREATED', 'PREPARING', 'READY', 'IN_DELIVERY'];

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function getOhmById(id) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({ id })
        .value()

      if(!ohm)
        throw new NotFoundError();

    return ohm;
}

async function reorder(id) {
  const _db = await db;
    const ohm = _db.get('ohms')
        .find({ id })
        .value()

      if(!ohm)
        throw new NotFoundError();

  const newId = new String(_db.get('ohms').value().length);

  await _db.get('ohms').push({
    ...ohm,
    id         : newId,
    status     : trackingStatuses[0],
    history    : [{state : trackingStatuses[0], at : new String(Date.now())}],
    comment    : '',
    trackingId : makeid(8)
  }).write();

  return await _db.get('ohms').find({id : newId});
}

async function getOhmByTrackingId(trackingId) {
  const _db = await db;
    const ohm = _db.get('ohms')
        .find({ trackingId })
        .value()

    if(!ohm)
      throw new NotFoundError();

    return ohm;
}

async function addCommentToOhmByid(id, comment) {
  const _db = await db;
  const ohm = _db.get('ohms').find({id});

  if(!ohm)
      throw new NotFoundError();

  console.log(id);
  console.log(comment);
  console.log(ohm.value());

  return await ohm.assign({comment}).write();
}


async function progressTrackingById(id) {
  const _db = await db;
  const ohm = _db.get('ohms').find({id});

  if(!ohm.value())
    throw new NotFoundError();
  
  const trackStatus = ohm.value().status;
  let nextStatus = getNextStatus(trackStatus);

  if(!nextStatus)
    throw new BadRequestError('Cannot progress tracking further')

  // Update status
  let res = _db.get('ohms').find({id}).assign({status : nextStatus});
  
  // Add history entry
  res.get('history').push({
    state : nextStatus,
    at : new String(Date.now())
  }).write();

  console.log(res);

  return res;
}

async function finalizeTrackingByid(id, success, note) {
  const _db = await db;
  const ohm = _db.get('ohms').find({id});
  const status = success ? 'DELIVERED' : 'REFUSED';

  if(!ohm.value())
    throw new NotFoundError();

  if(!canStatusFinalize(ohm.value().status))
    throw new BadRequestError('This tracking cannot be finalized');

  let res = ohm.assign({status});

  res.get('history').push({
    state : status,
    at    : new String(Date.now()),
    note
  }).write();

  return res;
}

function getNextStatus(trackStatus) {
  if(!trackStatus || !trackingStatuses.includes(trackStatus) || trackingStatuses.indexOf(trackStatus) == trackingStatuses.length - 1)
    return null;
  
  return trackingStatuses[trackingStatuses.indexOf(trackStatus) + 1];
}

function canStatusFinalize(trackStatus) {
  return trackStatus && trackingStatuses.indexOf(trackStatus) == trackingStatuses.length - 1;
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = { getOhmById, getOhmByTrackingId, trackingStatuses, progressTrackingById, addCommentToOhmByid, finalizeTrackingByid, reorder }