/*
 * Attachment Files Express Router
 * 
 * get : To download the passed file
 * add : To upload a file
 * remove: to remove a file
 */
var AttachmentFile = require('./attachmentFile').AttachmentFile;

exports.AttachmentFileRouter = function(app, config) {

    'use strict';

    var attachmentFile = new AttachmentFile(config, app.logger.error);

    if (!config.attachDir || !config.attachDir.length) {
        // Defaults to current root folder
        config.attachdir = '.';
    }

    var onAddError = function(req, res) {
        return function(err) {
            app.logger.error(err);
            res.send(err);
        };
    };

    var onAddSuccess = function(req, res) {
        return function(result) {
            res.send('Upload complete: ' + result);
        };
    };

    this.add = function(req, res) {
        // get the temporary location of the file
        var tmpPath = req.files.file.path;
        var name = req.files.file.name;
        attachmentFile.add(tmpPath, name, onAddSuccess(req, res), onAddError(req, res));
    };

    var onRemoveError = function(req, res) {
        return function(err) {
            if (err.errno === 34) {
                return res.send('None existing file.');
            }
            return res.send('Error occured while removing file.');
        };
    };

    var onRemoveSuccess = function(req, res) {
        return function(result) {
            return res.send('Done Removing file : ' + result);
        };
    };

    this.remove = function(req, res){
        var name = req.body.file;
        if (!name) {
            return res.send('Please specify a file to remove.');
        }
        attachmentFile.remove(name, onRemoveSuccess(req, res), onRemoveError(req, res));
    };

    this.get = function(req, res) {
        var name = req.query.file || req.body.file;
        if (!name) {
            return res.send('Please specify a file to download.');
        }
        var onSuccess = function(path) {
            res.download(path);
        }

        var onError = function(err) {
            res.send(err);
        }
        attachmentFile.get(name, onSuccess, onError);
    };

    var url = config.attachUrl || '/attachmentFile';

    app.post(url, this.add);
    app.get(url, this.get);
    app.del(url, this.remove);

    return this;
};
