/**
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

// @see https://mandrillapp.com/api/docs/messages.JSON.html
var Q = require('q');

function Send(podConfig) {
}

Send.prototype = {};

function unpackAddresses(addrs, type, ptr) {
  if (addrs) {
    var addrs = addrs.split(' ');
    for (var i = 0; i < addrs.length; i++) {
      ptr.push({
        type : type,
        email : addrs[i].trim()
      });
    }
  }
}

Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var f,
    self = this,
    $resource = this.$resource,
    struct = {
      key : sysImports.auth.issuer_token.password,
      message : {
        html : imports.html,
        text : imports.text,
        subject : imports.subject,
        from_email : imports.from_email,
        from_name : imports.from_name,
        to : [
          {
            email : imports.to_email,
            type : "to"
          }
        ]
      }
    }

  unpackAddresses(imports.cc_address, 'cc', struct.message.to);
  unpackAddresses(imports.bcc_address, 'bcc', struct.message.to);

  this.pod.POST('messages/send.json', struct, next);
  return;

  // @todo file uploads
  if (false && contentParts._files.length) {
    var promises = [],
      deferred;

    struct.message.attachments = [];
    struct.message.images = [];

    for (var i = 0; i < contentParts._files.length; i++) {
      deferred = Q.defer();
      promises.push(deferred.promise);

      (function(file, deferred) {

      })(contentParts._files[i], deferred);
    }

    Q.all(promises).then(function() {

    });

  } else {
    this.pod.POST('messages/send.json', struct, next);
  }



}

// -----------------------------------------------------------------------------
module.exports = Send;
