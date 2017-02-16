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

function TemplateRender(podConfig) {
}

TemplateRender.prototype = {};

TemplateRender.prototype.render = function(struct, next) {
  this.pod.POST('templates/render.json', struct, next);
}

TemplateRender.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var f,
    self = this,
    $resource = this.$resource,
    struct = {
      key : sysImports.auth.issuer_token.password,
      template_name: imports.template_name,
      template_content: [],
      merge_vars : []
    };

  if (imports.template_content && imports.editable_name) {
    struct.template_content.push(
      {
       name: imports.editable_name,
       content: imports.template_content
      }
    );
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

          struct.merge_vars.push(
            {
              name : key,
              content : value
            }
          );
        }

        self.render(struct, next);
      }
    })

  } else {
    this.render(struct, next);
  }
}

// -----------------------------------------------------------------------------
module.exports = TemplateRender;
