'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const project = 'testproject';

suite('Functional Tests', function () {

  suite('POST /api/issues/{project}', function () {

    test('Create an issue with every field', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Alice',
          assigned_to: 'Bob',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Alice');
          assert.equal(res.body.assigned_to, 'Bob');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
          assert.isNumber(Date.parse(res.body.created_on));
          assert.isNumber(Date.parse(res.body.updated_on));
          assert.isNotEmpty(res.body._id);
          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({
          issue_title: 'A Title',
          issue_text: 'Some text content',
          created_by: 'Bob'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'A Title');
          assert.equal(res.body.issue_text, 'Some text content');
          assert.equal(res.body.created_by, 'Bob');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.open, true);
          assert.isNotEmpty(res.body._id);
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({ created_by: 'Bob' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });

  });

  suite('GET /api/issues/{project}', function () {

    test('View issues on a project', function (done) {
      chai.request(server)
        .get('/api/issues/' + project)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);
          res.body.forEach(function (issue) {
            assert.property(issue, 'issue_title');
            assert.property(issue, 'issue_text');
            assert.property(issue, 'created_by');
            assert.property(issue, 'assigned_to');
            assert.property(issue, 'status_text');
            assert.property(issue, 'open');
            assert.property(issue, 'created_on');
            assert.property(issue, 'updated_on');
            assert.property(issue, '_id');
          });
          done();
        });
    });

    test('View issues on a project with one filter', function (done) {
      chai.request(server)
        .get('/api/issues/' + project + '?open=false')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(function (issue) {
            assert.equal(issue.open, false);
          });
          done();
        });
    });

    test('View issues on a project with multiple filters', function (done) {
      chai.request(server)
        .get('/api/issues/' + project + '?assigned_to=Bob&status_text=In%20QA')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(function (issue) {
            assert.equal(issue.assigned_to, 'Bob');
            assert.equal(issue.status_text, 'In QA');
          });
          done();
        });
    });

  });

  suite('PUT /api/issues/{project}', function () {

    test('Update one field on an issue', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({ issue_title: 'To Update', issue_text: 'Original text', created_by: 'Alice' })
        .end(function (err, res) {
          const id = res.body._id;
          chai.request(server)
            .put('/api/issues/' + project)
            .send({ _id: id, issue_text: 'Updated text' })
            .end(function (err2, res2) {
              assert.equal(res2.status, 200);
              assert.deepEqual(res2.body, { result: 'successfully updated', _id: id });
              done();
            });
        });
    });

    test('Update multiple fields on an issue', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({ issue_title: 'To Update Multi', issue_text: 'Original', created_by: 'Alice' })
        .end(function (err, res) {
          const id = res.body._id;
          chai.request(server)
            .put('/api/issues/' + project)
            .send({ _id: id, issue_title: 'New Title', assigned_to: 'Carol', open: false })
            .end(function (err2, res2) {
              assert.equal(res2.status, 200);
              assert.deepEqual(res2.body, { result: 'successfully updated', _id: id });
              done();
            });
        });
    });

    test('Update an issue with missing _id', function (done) {
      chai.request(server)
        .put('/api/issues/' + project)
        .send({ issue_text: 'No id here' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Update an issue with no fields to update', function (done) {
      chai.request(server)
        .put('/api/issues/' + project)
        .send({ _id: '5f665eb46e296f6b9b6a504d' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: '5f665eb46e296f6b9b6a504d' });
          done();
        });
    });

    test('Update an issue with an invalid _id', function (done) {
      chai.request(server)
        .put('/api/issues/' + project)
        .send({ _id: '5f665eb46e296f6b9b6a504d', issue_text: 'New Issue Text' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', _id: '5f665eb46e296f6b9b6a504d' });
          done();
        });
    });

  });

  suite('DELETE /api/issues/{project}', function () {

    test('Delete an issue', function (done) {
      chai.request(server)
        .post('/api/issues/' + project)
        .send({ issue_title: 'To Delete', issue_text: 'Delete me', created_by: 'Alice' })
        .end(function (err, res) {
          const id = res.body._id;
          chai.request(server)
            .delete('/api/issues/' + project)
            .send({ _id: id })
            .end(function (err2, res2) {
              assert.equal(res2.status, 200);
              assert.deepEqual(res2.body, { result: 'successfully deleted', _id: id });
              done();
            });
        });
    });

    test('Delete an issue with an invalid _id', function (done) {
      chai.request(server)
        .delete('/api/issues/' + project)
        .send({ _id: '5f665eb46e296f6b9b6a504d' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', _id: '5f665eb46e296f6b9b6a504d' });
          done();
        });
    });

    test('Delete an issue with missing _id', function (done) {
      chai.request(server)
        .delete('/api/issues/' + project)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

  });

});