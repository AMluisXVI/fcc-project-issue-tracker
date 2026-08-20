'use strict';

module.exports = function (app) {

  const crypto = require('crypto');
  const projects = new Map();

  const EDITABLE_FIELDS = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];

  function normalizeBoolean(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  }

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const issues = (projects.get(project) || []).filter(function (issue) {
        return Object.keys(req.query).every(function (key) {
          const expected = key === 'open' ? normalizeBoolean(req.query[key]) : String(req.query[key]);
          return String(issue[key]) === String(expected);
        });
      });
      res.json(issues);
    })

    .post(function (req, res) {
      let project = req.params.project;

      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to || '';
      const status_text = req.body.status_text || '';

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const issue = {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        open: true,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        _id: crypto.randomUUID()
      };

      if (!projects.has(project)) {
        projects.set(project, []);
      }
      projects.get(project).push(issue);

      res.json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;

      const _id = req.body._id;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const updates = Object.keys(req.body).filter(function (field) {
        return field !== '_id' && EDITABLE_FIELDS.includes(field);
      });

      if (updates.length === 0) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }

      const issues = projects.get(project) || [];
      const issue = issues.find(function (i) {
        return i._id === _id;
      });

      if (!issue) {
        return res.json({ error: 'could not update', _id: _id });
      }

      updates.forEach(function (field) {
        issue[field] = field === 'open' ? normalizeBoolean(req.body[field]) : req.body[field];
      });
      issue.updated_on = new Date().toISOString();

      res.json({ result: 'successfully updated', _id: _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;

      const _id = req.body._id;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const issues = projects.get(project) || [];
      const index = issues.findIndex(function (i) {
        return i._id === _id;
      });

      if (index === -1) {
        return res.json({ error: 'could not delete', _id: _id });
      }

      issues.splice(index, 1);

      res.json({ result: 'successfully deleted', _id: _id });
    });

};