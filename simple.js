/**
 *
 * The Bipio Send Pod.  mandrill sample action definition
 * ---------------------------------------------------------------
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

function Send(podConfig) {
  this.name = 'send'; // action name (channel action suffix - "action: mandrill.send")
  this.title = 'short description', // short description
  this.description = 'the long description', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Send.prototype = {};

// Send schema definition
// @see http://json-schema.org/
Send.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "instring_override" : {
          "type" :  "string",
          "description" : "String goes in"
        }
      }
    },
    "imports": {
      "properties" : {
        "instring" : {
          "type" :  "string",
          "description" : "String goes in"
        }
      }
    },
    "exports": {
      "properties" : {
        "outstring" : {
          "type" : "string",
          "description" : "String goes out"
        }
      }
    },
    'renderers' : {
      'hello' : {
        description : 'Hello World',
        description_long : 'Hello World',
        contentType : DEFS.CONTENTTYPE_XML
      }     
    }
  }
}

// RPC/Renderer accessor - /rpc/render/channel/{channel id}/hello
Send.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'hello') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send('world');
  } else {
    res.send(404);
  }
}

/**
 * Action Invoker - the primary function of a channel
 * 
 * @param Object imports transformed key/value input pairs
 * @param Channel channel invoking channel model
 * @param Object sysImports
 * @param Array contentParts array of File Objects, key/value objects
 * with attributes txId (transaction ID), size (bytes size), localpath (local tmp file path)
 * name (file name), type (content-type), encoding ('binary') 
 * 
 * @param Function next callback(error, exports, contentParts, transferredBytes)
 * 
 */
Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(
    false,
    {
      "outstring" : channel.config.instring_override || imports.instring
    }
    );
}

// -----------------------------------------------------------------------------
module.exports = Send;