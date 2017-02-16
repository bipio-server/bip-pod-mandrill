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

// @see https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
var csv = require('csv');

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
  this.pod.POST('messages/send-template.json', struct, next);
}

SendTemplate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var f,
    self = this,
    $resource = this.$resource,
    struct = {
      key : sysImports.auth.issuer_token.password,
      template_name: imports.template_name,
      template_content : [
        {
      	  name: imports.subject,
      	  content: ""
    		}
      ],
      message : {
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
        ],
        important : imports.important,
        track_opens : imports.track_opens,
        track_clicks : imports.track_clicks,
        auto_text : imports.auto_text,
        auto_html : imports.auto_html,
        inline_css : imports.inline_css,
        url_strip_qs : imports.url_strip_qs,
        preserve_recipients : imports.preserve_recipients,
        view_content_link : imports.view_content_link,
        tracking_domain : imports.tracking_domain,
        signing_domain : imports.signing_domain,
        return_path_domain : imports.return_path_domain,
        ip_pool : imports.ip_pool,
        send_at : imports.send_at
      }
    };

  unpackAddresses(imports.cc_address, 'cc', struct.message.to);
  unpackAddresses(imports.bcc_address, 'bcc', struct.message.to);

  // strip undefined fields form message
  for (var k in struct.message) {
    if (undefined === struct.message[k]) {
      delete struct.message[k];
    }
  }

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

        self.send(struct, next);
      }
    })

  } else {
    this.send(struct, next);
  }

}

// -----------------------------------------------------------------------------
module.exports = SendTemplate;
