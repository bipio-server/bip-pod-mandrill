/**
 *
 * @author Michael Pearson <michael@bip.io>
 * Copyright (c) 2010-2014 WoT.IO
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

// @see https://mandrillapp.com/api/docs/messages.JSON.html
var Q = require('q');

function Send(podConfig) {
  this.name = 'send';
  this.title = 'Send an Email';
  this.description = 'Send an Email';
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

Send.prototype = {};

Send.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "from_email" : {
          "type" :  "string",
          "description" : "Default From Address"
        },
        "from_name" : {
          "type" :  "string",
          "description" : "From Name"
        }
      },
      "required" : [ "from_email" ]
    },
    "imports": {
      "properties" : {
        "to_email" : {
          "type" :  "string",
          "description" : "To Address"
        },
        "cc_address" : {
          "type" :  "string",
          "description" : "Cc (space separated)"
        },
        "bcc_address" : {
          "type" :  "string",
          "description" : "Bcc (space separated)"
        },
        "subject" : {
          "type" :  "string",
          "description" : "Subject"
        },
        "text" : {
          "type" :  "string",
          "description" : "Text"
        },
        "html" : {
          "type" :  "string",
          "description" : "HTML"
        }
      },
      "required" : [ "from_email", "to_email" ]
    },
    "exports": {
      "properties" : {
        "email" : {
          "type" :  "string",
          "description" : "Email Address"
        },
        "status" : {
          "type" :  "string",
          "description" : "Status"
        },
        "_id" : {
          "type" :  "string",
          "description" : "Message ID"
        },
        "reject_reason" : {
          "type" :  "string",
          "description" : "Rejection Reason"
        }
      }
    }
  }
}

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

Send.prototype.send(struct, next) {
  this.$resource._httpPost('https://mandrillapp.com/api/1.0/messages/send.json', struct, function(err, resp) {
    next(err, resp);
  });
}

Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var f,
    struct = {
      key : sysImports.auth.issuer_token.password,
      message : {
        html : imports.html,
        text : imports.text,
        subject : imports.subject,
        from_email : channel.config.from_email,
        from_name : channel.config.from_name,
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

  this.send(struct, next);
/*
 * @todo - pending cdn strategy (0.3 sansa)
  if (contentParts._files.length) {
    var promises = [],
      deferred;

    struct.message.attachments = [];
    struct.message.images = [];

    for (var i = 0; i < contentParts._files.length; i++) {
      deferred = Q.defer();
      promises.push(deferred.promise);

      if (0 === f.indexOf('image/')) {
        (function(file, deferred) {

        })(contentParts._files[i], deferred);
      }
    }

    Q.all(promises).then(function() {

    });

  } else {
    this.send(struct, next);
  }
*/


}

// -----------------------------------------------------------------------------
module.exports = Send;
