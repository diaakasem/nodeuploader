/* global require, expect, describe, it */
var fs, request, url, path, uploads;

request = require('request');
path = require('path');
fs = require('fs');

url = 'http://localhost:3000/attachFile';
uploads = path.join(__dirname, '..', '..', 'uploads');

describe('Attachment File Routrs', function() {
    'use strict';
    describe('get attachFile', function() {
        it('show throw error if no file specified', function(done) {
            request.get(url, function(err, res, body) {
                expect(res.statusCode).toEqual(200);
                expect(body).toEqual('Please specify a file to download.');
                done();
            });
        });

        it('show download existing files', function(done) {
            var list = fs.readdirSync(uploads);
            if (list.length) {
                request.get(url + '?file=' + list[0] , function(err, res, body) {
                    expect(res.statusCode).toEqual(200);
                    expect(body).toMatch(/test content\s*/);
                    done();
                });
            } else {
                var r = request.post(url, function(err, res, body) {
                    var list = fs.readdirSync(uploads);
                    if (list.length) {
                        request.get(url + '?file=' + list[0] , function(err, res, body) {
                            expect(res.statusCode).toEqual(200);
                            expect(body).toMatch(/test content\s*/);
                            done();
                        });
                    } else { 
                        console.log("error");
                        done();
                    }
                });
                var form = r.form();
                var filePath = path.normalize(path.join(__dirname, '../test.txt'));
                form.append('file', fs.createReadStream(filePath));
            }
        });
    });

    describe('remove uploaded file', function() {
        it('should produce an error on empty file name', function(done) {
            request.del(url, {}, function(err, res, body) {
                expect(res.statusCode).toEqual(200);
                expect(body).toMatch(/Please specify a file to remove./);
                done();
            });
        });

        it('should remove file from file system', function(done) {
            var list = fs.readdirSync(uploads);
            if (list.length) {
                var toBeDeleted = list[0];
                request.del({url: url, json: {file: toBeDeleted} }, function(err, res, body) {
                    expect(res.statusCode).toEqual(200);
                    expect(body).toEqual('Done Removing file : uploads/' + toBeDeleted);
                    var existing = fs.existsSync(path.join(uploads, toBeDeleted));
                    expect(existing).toBe(false);
                    done();
                });
            } else {
                var r = request.post(url, function(err, res, body) {
                    var list = fs.readdirSync(uploads);
                    if (list.length) {
                        var toBeDeleted = list[0];
                        console.log("to Delete " + toBeDeleted);
                        request.del({url: url, json: {file: toBeDeleted} }, function(err, res, body) {
                            expect(res.statusCode).toEqual(200);
                            expect(body).toEqual('Done Removing file : uploads/' + toBeDeleted);
                            var existing = fs.existsSync(path.join(uploads, toBeDeleted));
                            expect(existing).toBe(false);
                            done();
                        });
                    } else { 
                        console.log("error");
                        done();
                    }
                });
                var form = r.form();
                var filePath = path.normalize(path.join(__dirname, '../test.txt'));
                form.append('file', fs.createReadStream(filePath));
            }
        });
    });

    describe('post attachFile', function() {
        it('should responde with successful message', function(done) {
            var r = request.post(url, function(err, res, body) {
                expect(res.statusCode).toEqual(200);
                expect(body).toMatch(new RegExp('Upload complete: uploads/test_.*.txt'));
                done();
            });
            var form = r.form();
            var filePath = path.normalize(path.join(__dirname, '../test.txt'));
            form.append('file', fs.createReadStream(filePath));
        });
    });
});

