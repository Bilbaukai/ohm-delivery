const shortid = require('shortid')
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
const Utils = require('./utils');
app.use(bodyParser.json())

function serve() {


    app.get('/ohms/:id', async (req, res) => {
        try {
            res.send(Utils.getOhmById(req.params.id));
        } catch (error) {
            handleError(error, res);
        }
    });

    app.get('/ohms/track/:trackingId', async (req, res) => {
        try {
            res.send(await Utils.getOhmByTrackingId(req.params.trackingId));
        } catch (error) {
            handleError(error, res)
        }
    });

    app.get('/trackingStatuses', async (req, res) => res.send(Utils.trackingStatuses));

    app.post('/ohms/:id/progress', async (req, res) => {
        try {
            res.send(await Utils.progressTrackingById(req.params.id));
        } catch (error) {
            handleError(error, res);
        }
    });

    app.post('/ohms/:id/addcomment', async (req, res) => {
        try {
            res.send(await Utils.addCommentToOhmByid(req.params.id, req.body.comment));
        } catch (error) {
            handleError(error, res);
        }
    });

    app.post('/ohms/:id/reorder', async (req, res) => {
        try {
            res.send(await Utils.reorder(req.params.id));
        } catch (error) {
            handleError(error, res);
        }
    });

    app.post('/ohms/:id/finalize', async (req, res) => {
        try {
            res.send(await Utils.finalizeTrackingByid(req.params.id, req.body.success, req.body.note));
        } catch (error) {
            handleError(error, res);
        }
    });

    app.listen(3000, () => console.log('listening on port 3000'));
}

function handleError(err, res) {
    console.log("ERROR");
    return res.status(err.statusCode || 500).send(err.message);
}

serve();