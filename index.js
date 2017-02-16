/**
 *
 * mandrill Actions and Content Emitters
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
