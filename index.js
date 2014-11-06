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
    Mandrill = new Pod({
      name : 'mandrill',
      title : 'Mandrill',
      description : '<a href="https://mandrill.com" target="_blank">Mandrill</a> is a transactional email platform from MailChimp',
      authType : 'issuer_token',
      authMap : {
        password : 'API Key'
      }
    });

// Include any actions
Mandrill.add(require('./send.js'));

// -----------------------------------------------------------------------------
module.exports = Mandrill;
