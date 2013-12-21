/*
 * Attachment Files FS APIs
 * 
 * add : To move file from tmp directory to uploads directory.
 * remove : To delete file in the passed path.
 */
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');

exports.AttachmentFile = function(config, log) {

    var sanitize = function (name) {
        if (!name) {
            return '';
        }
        name = path.normalize(name);
        name = name.replace(path.sep, '_');
        return name;
    };

    var uuidName = function (name) {
        var ext = path.extname(name);
        return path.basename(name, ext) + '_' + uuid.v4() + ext;
    };

    'use strict';
    this.add = function(tmpPath, name, successCallback, errorCallback) {
        // set where the file should actually exists - in this case it is in the "images" directory
        name = sanitize(uuidName(name));
        var targetPath = path.join(config.attachDir, name);
        // move the file from the temporary location to the intended location
        fs.rename(tmpPath, targetPath, function(err) {
            if (err) {
                errorCallback(err);
            }
            // delete the temporary file, so that the explicitly set temporary
            // upload dir does not get filled with unwanted files
            // It should be already deleted from the rename method 
            // but just in case
            fs.unlink(tmpPath, function(err) {
                if (err) {
                    // Error 34 means tmp file is not there
                    // which means that rename method has removed it.
                    if (err.errno !== 34) {
                        log('Error while removing tmp file of ' + tmpPath);
                    }
                }
                successCallback(targetPath);
            });
        });
    };

    this.remove = function(name, successCallback, errorCallback){
        var name = sanitize(name);
        var filePath = path.join(config.attachDir, name);
        fs.unlink(filePath, function(err) {
            if (err) {
                return errorCallback(err);
            }
            return successCallback(filePath);
        });
    };

    this.get = function(name, successCallback, errorCallback) {
        try{
            name = sanitize(name);
            var filePath = path.join(config.attachDir, name);
            successCallback(filePath);
        }catch (e){
            errorCallback(e);
        }
    };

    return this;
};
