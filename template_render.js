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

function TemplateRender(podConfig) {
}

TemplateRender.prototype = {};

TemplateRender.prototype.render = function(struct, next) {
  this.$resource._httpPost('https://mandrillapp.com/api/1.0/templates/render.json', struct, function(err, resp) {
    next(err, resp);
  });
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
