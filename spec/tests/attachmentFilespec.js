/* global require, expect, describe, it, spyOn, jasmine */
var fs, url, path, uploads;

var AttachmentFile = require('../../routes/attachmentFile').AttachmentFile;
path = require('path');
fs = require('fs');

url = 'http://localhost:3000/attachFile';
uploads = path.join(__dirname, '..', '..', 'uploads');

var config = {
    attachDir: uploads
};

var logger = function(msg) {
    'use strict';
    console.log('error:' +msg);
};

var attachmentFile = new AttachmentFile(config, logger);
var fileName = 'test.txt';
var expectedPath = path.join(config.attachDir, fileName);

describe('Attachment File', function() {
    'use strict';
    describe('get attachFile', function() {
        it('should call success with file path', function() {
            var success = jasmine.createSpy('success');
            var error = jasmine.createSpy('error');
            attachmentFile.get(fileName, success, error);
            expect(success).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('remove uploaded file', function() {
        it('should call unlink and success method with file path', function() {
            var success = jasmine.createSpy('success');
            var error = jasmine.createSpy('error');
            var list = fs.readdirSync(uploads);
            var unlink = spyOn(fs, 'unlink').andCallThrough();
            if (list.length) {
                var fileName = list[0];
                attachmentFile.remove(fileName, success, error);
                expect(unlink).toHaveBeenCalledWith(path.join(uploads, fileName), jasmine.any(Function));
            }
        });
    });

    describe('post attachFile', function() {
        it('should call rename with tmpPath and name and call success', function() {
            var success = jasmine.createSpy('success');
            var error = jasmine.createSpy('error');
            var list = fs.readdirSync(uploads);
            var rename = spyOn(fs, 'rename').andCallThrough();
            if (list.length) {
                var fileName = 'test';
                var tmpPath = path.join(uploads, list[list.length-1]);
                attachmentFile.add(tmpPath, fileName, success, error);
                expect(rename).toHaveBeenCalledWith(tmpPath, jasmine.any(String), jasmine.any(Function));
            }
        });
    });
});

