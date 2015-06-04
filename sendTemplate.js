/**
 *
 * @author elie youssef <elie.youssef@elementn.com>
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

// @see https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template

var Q = require('q');

function SendTemplate(podConfig) {
}

SendTemplate.prototype = {};

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

SendTemplate.prototype.send = function(struct, next) {
  this.$resource._httpPost('https://mandrillapp.com/api/1.0/messages/send-template.json', struct, function(err, resp) {
    next(err, resp);
  });
}

SendTemplate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var f,
    self = this,
    $resource = this.$resource,
    struct = {
      key : sysImports.auth.issuer_token.password,
      template_name: channel.config.template_name,
      template_content:[{
    	  name: imports.subject,
    	  content: ""
    		  }],
      message : {
        html : "",
        subject : imports.subject,
        from_email : channel.config.from_email,
        from_name : channel.config.from_name,
        to : [{
            email : imports.to_email,
            type : "to"
          }],
        merge_vars:[{
        	rcpt: imports.to_email,
        	vars: [{
                name: "username",
                content: imports.username
            },
            {
                name : "lastname",
                content : imports.last_mame
            },
            {
                name: "email",
                content: imports.email
            }]
        }]
      }
    };

  unpackAddresses(imports.cc_address, 'cc', struct.message.to);
  unpackAddresses(imports.bcc_address, 'bcc', struct.message.to);

  this.send(struct, next);

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
    this.send(struct, next);
  }



}

// -----------------------------------------------------------------------------
module.exports = SendTemplate;
