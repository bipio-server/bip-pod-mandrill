/**
 *
 * mandrill Actions and Content Emitters
 *
 * @author Scott Tuddenham <scott@bip.io>
 * Copyright (c) 2014 WoT.io http://wot.io
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Pod = require('bip-pod'),
    Mandrill = new Pod();

Mandrill.POST = function(path, struct, next) {
  this.$resource._httpPost('https://mandrillapp.com/api/1.0/' + path, struct, function(err, resp) {
    if (resp && resp.length) {
      resp = resp.shift();
    }
    if (!err && resp && resp.status === 'invalid') {
      err = resp.reject_reason || (resp.status + " (No Reason Given)" );
    }
    next(err, resp);
  });
}

Mandrill.rpc = function(action, method, sysImports, options, channel, req, res) {
  var self = this;

  if (method == 'templates_list') {

    this._httpPost(
      'https://mandrillapp.com/api/1.0/templates/list.json',
      {
        key : sysImports.auth.issuer_token.password
      },
      function(err, body) {
        if (err) {
          res.status(500).end();
        } else {
          res.send(body);
        }
      }
    );

  } else {
    this.__proto__.rpc.apply(this, arguments);
  }
}

// -----------------------------------------------------------------------------
module.exports = Mandrill;
