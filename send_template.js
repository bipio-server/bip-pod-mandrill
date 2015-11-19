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

var csv = require('csv');

function SendTemplate(podConfig) {
}

SendTemplate.prototype = {};

/*
 * disabled - now UI for cc/bcc merge_vers mapping
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
*/
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
      template_name: imports.template_name,
      template_content:[{
    	  name: imports.subject,
    	  content: ""
    		  }],
      message : {
        html : "",
        merge_language : imports.merge_language,
        global_merge_vars:[],
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
    };

  //unpackAddresses(imports.cc_address, 'cc', struct.message.to);
  //unpackAddresses(imports.bcc_address, 'bcc', struct.message.to);

  if (imports.merge_vars) {

    csv.parse(imports.merge_vars, function(err, data) {
      if (err) {
        next(err);
      } else {
        var tokens, key, value;
        for (var i = 0; i < data[0].length; i++) {
          tokens = data[0][i].split('=');
          key = tokens.shift();
          value = tokens.join('=');

          struct.message.global_merge_vars.push(
            {
              name : key,
              content : value
            }
          );
        }

//        console.log(struct.message.global_merge_vars);

        self.send(struct, next);
      }
    })

  } else {
    this.send(struct, next);
  }

}

// -----------------------------------------------------------------------------
module.exports = SendTemplate;
