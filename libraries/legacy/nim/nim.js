/*
 * All software Copyright 2021 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */


function nim_report(url, width = 600, height = 600)
{
   var target = Math.round(Math.random() * 100000);
   var options = `location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=${width},height=${height}`;
   window.open(url, target, options);
   return false;
}


function edit_emoi(emoi, flags)
{
   var url = "/cgi/nimc06?mode=edit&emoi=" + emoi + "&default_flags=" + flags;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=100";
   window.open(url, target, options);
   return false;
}

function edit_creds(device_name)
{
   var url = "/cgi/nim-edit-snmp-creds?action=edit&name=" + device_name;
   var target = "edit_snmp_creds";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=400,height=290";
   window.open(url, target, options);
   return false;
}

function emoi_toggle_poll(emoi, val)
{
   var url = "/cgi/nim-cfg-emoi-toggle-poll?emoi=" + emoi + "&val=" + val;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=100";
   window.open(url, target, options);
   window.location.reload();
   return false;
}


function emoi_toggle_on_off(emoi, val)
{
   var url = "/cgi/nim-cfg-emoi-toggle-on-off?emoi=" + emoi + "&val=" + val;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=100";
   window.open(url, target, options);
   window.location.reload();
   return false;
}

function nucast_toggle_on_off(device, index, val)
{
   var url = "/cgi/nim-cfg-nucast-toggle-on-off?device=" + device + "&index=" + index + "&val=" + val;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=100";
   window.open(url, target, options);
   window.location.reload();
   return false;
}

function if_state(emoi, ifname, state)
{
   var url = "/cgi/nim-cfg-if-state?emoi=" + emoi + "&ifname=" + ifname + "&state=" + state;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=100";
   window.open(url, target, options);
   window.location.reload();
   return false;
}


function edit_device(name)
{
   var url = "/cgi/nim-cfg-edit-device?mode=edit&device=" + name;
   var target = "edit_emoi";
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=no,resizable=yes,width=700,height=150";
   window.open(url, target, options);
   return false;
}


function nim_ev_add_note(event_database, event_id, record_time)
{
   var url = "/cgi/nimc03?mode=Edit&ev_db=" + event_database + "&event_id=" + event_id + "&record_time=" + record_time;
   var target = Math.round(Math.random() * 100000);
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=700,height=120";
   window.open(url, target, options);
   return false;
}


/* Display popup images */
function display_graph(vars)
{
   ajax_post("/cgi/nim-graph", vars, display_graph_callback);
   return false;
}


/* nim-graph response format: $filename,$name */
function display_graph_callback(response) {
   const vars = response.split(',');
   let img = document.getElementById(vars[1].trim());
   if (img !== null)
      img.src = vars[0];

   return false;
}


/* Common Drilldowns */
function drilldown(url, width = 800, height = 600)
{
   var target = Math.round(Math.random() * 100000);
   var options = `location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=${width},height=${height}`;
   window.open(url, target, options);
   return false;
}


/* Last N Drilldowns */
function lastn_dd(url, width = 800, height = 600)
{
   var target = Math.round(Math.random() * 100000);
   var options = `location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=${width},height=${height}`;
   window.open('/cgi/nim-report-lastn-drilldown?' + url, target, options);
   return false;
}


/* Keep the query string and the server but replace the file part
 *
 * To keep things simple it currently assumes:
 *  - the old file is in the cgi directory
 *  - the new file is in the cgi directory
 *  - the file to replace is closest to the '?'
 *  - the '?' exists
 *
 * So pretty much we want to replace oldfilename below
 * with the new one
 *
 * http://servers.blah.foo/cgi/{oldfilename}?args
 *
 */
function url_replace_source(url, key, val)
{
   return url.replace(/^([^?]*cgi\/)([^?]*?)(\?.*)$/, '$1' + key + '$3');
}

/* More aggressive form of below. */
function url_replace_key_value_2(url, key, val)
{
   var newurl;
   var pattern = new RegExp(key + "=[^&]*");

   if (url.search(pattern) != -1) {
      newurl = url.replace(pattern, key + "=" + encodeURIComponent(val));
   }
   else if (url.search(/\?/) != -1) {
      newurl = url + "&" + key + "=" + encodeURIComponent(val);
   }
   else {
      newurl = url + "?" + key + "=" + encodeURIComponent(val);
   }

   return newurl;


}


function url_replace_key_value(url, key, val)
{
   var newurl;
   var pattern = new RegExp(key + "=[a-zA-Z0-9]*");

   if (url.search(pattern) != -1) {
      newurl = url.replace(pattern, key + "=" + val);
   }
   else if (url.search(/\?/) != -1) {
      newurl = url + "&" + key + "=" + val;
   }
   else {
      newurl = url + "?" + key + "=" + val;
   }

   return newurl;
}

function invshowmore(a)
{
   if (a.innerHTML.match(/more/)) {
      a.parentNode.getElementsByTagName('SPAN')[0].style.display = 'inline';
      ssutils_set_innerHTML(a, 'less');
   }
   else {
      a.parentNode.getElementsByTagName('SPAN')[0].style.display = 'none';
      ssutils_set_innerHTML(a, 'more');
   }
   return false;
}


function open_inv(reg)
{
   var url = document.URL;
   url = url_replace_source(url, 'nim-report-inventory');
   url = url_replace_key_value(url, 'summary', 'no');
   url = url_replace_key_value(url, 'regex', encodeURIComponent(decodeURIComponent(reg)));
   url = url_replace_key_value(url, 'sort', 'Pdevice');
   var target = Math.round(Math.random() * 100000);
   var options = "location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=800,height=600";
   window.open(url, target, options);
}


function open_inv_eq(reg1, reg2, reg3, equal, equal2, width = 800, height = 600)
{
   var url = document.URL;
   url = url_replace_source(url, 'nim-report-inventory');
   url = url_replace_key_value(url, 'summary', 'no');
   url = url_replace_key_value(url, 'regex', '');
   url = url_replace_key_value(url, 'reg1', encodeURIComponent(decodeURIComponent(reg1)));
   if (reg2 != null)
      url = url_replace_key_value(url, 'reg2', encodeURIComponent(decodeURIComponent(reg2)));
   if (reg3 != null)
      url = url_replace_key_value(url, 'reg3', encodeURIComponent(decodeURIComponent(reg3)));
   if (equal != null)
      url = url_replace_key_value(url, 'equal', encodeURIComponent(decodeURIComponent(equal)));
   if (equal2 != null)
      url = url_replace_key_value(url, 'equal2', encodeURIComponent(decodeURIComponent(equal2)));
   url = url_replace_key_value(url, 'sort', 'Pdevice');
   var target = Math.round(Math.random() * 100000);
   var options = `location=no,menubar=no,toolbar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes,width=${width},height=${height}`;
   window.open(url, target, options);
}


function change_sum(sel)
{
   var url = document.URL;
   var rid = Math.round(Math.random() * 100000);

   url = url_replace_key_value_2(url, "summary_name", sel.value);
   url = url_replace_key_value_2(url, "rid", rid);
   location.replace(url);
}


function change_lastn(val)
{
   var url = document.URL;
   var rid = Math.round(Math.random() * 100000);

   url = url_replace_key_value(url, "last_n", val);
   url = url_replace_key_value(url, "rid", rid);
   location.replace(url);
}

function change_sum_report(val)
{
   var url = document.URL;
   var rid = Math.round(Math.random() * 100000);

   url = url_replace_key_value(url, "sum_report", val);
   url = url_replace_key_value(url, "rid", rid);
   location.replace(url);
}



/*
 * Options tool
 */

function display_element(id, show, flag)
{
   if (flag) {
      document.getElementById(id).style.display = show;
   }
   else {
      document.getElementById(id).style.display = 'none';
   }
}


function add_option()
{
   var name = document.getElementById('new_option').value;
   var oldHTML = document.getElementById('custom_options').innerHTML;
   var newHTML = '<div class="opt_row" id="' + name + '">'
               + '<span class="label">' + name + '</span>'
               + '<span class="input">'
               + '<input type="text" size="20" name="custom_' + name + '" value=""> '
               + '<input type="button" value="Delete" onclick="delete_option(\'' + name + '\'); return false;">'
               + '</span>'
               + '</div>'
               + oldHTML;

   ssutils_set_innerHTML(document.getElementById('custom_options'), newHTML);
   document.getElementById('new_option').value = "";
}


function delete_option(id)
{
   var newHTML = '<span class="label">' + id + '</span>'
               + '<span class="input txt_colour_red">Deleted</span>';

   ssutils_set_innerHTML(document.getElementById(id), newHTML);
}


/*
 * Reporting tool
 */

function nim_rt_report(d, c, o)
{
   var options = 'location=no,menubar=no,status=no,titlebar=no,toolbar=no,scrollbars=yes,resizable=yes';

   if (d.list.selectedIndex == -1) {
      alert("Select from the " + o + " list.");
      return false;
   }
   if (d.tfc.value == "") {
      alert("Enter a time filter.");
      return false;
   }
   d.rid.value = Math.round(Math.random() * 100000);
   d.command.value = c;
   d.target = Math.round(Math.random() * 100000);
   window.open('', d.target, options);
   d.submit();
}


function nim_rt_export(d, c, o)
{
   var orig_action = d.action;

   if (d.list.selectedIndex == -1) {
      alert("Select from the " + o + " list.");
      return false;
   }
   if (d.tfc.value == "") {
      alert("Enter a time filter.");
      return false;
   }
   d.rid.value = Math.round(Math.random() * 100000);
   d.command.value = c;
   d.action += '/' + d.mode.value + '.' + d.rtype.value + '.' + d.rid.value + '.csv';
   d.target = '_self';
   d.submit();
   d.action = orig_action;
}


function nim_rt_reset(d)
{
   d.reset();
   tfc_reset(d);
}


function nim_rt_set_ping(d)
{
   if (d.rtype.options[d.rtype.selectedIndex].text == "Delay") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Lost/Duplicate") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 9;
      d.x_step.selectedIndex = 11;
      d.graph_type.selectedIndex = 3;
   }
}


function nim_rt_set_interface(d)
{
   if (d.rtype.options[d.rtype.selectedIndex].text == "Utilization") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "BitsPerSecond") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Bytes") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Unicast Pkts") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Errors") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Discards") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "FECN/BECN") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 0;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "DiscardEligible") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 0;
   }
}


function nim_rt_set_servers(d)
{
   if (d.rtype.options[d.rtype.selectedIndex].text == "CPU") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "File System") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Memory (physical)") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Memory (virtual)") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
}


function nim_rt_set_cisco(d)
{
   if (d.rtype.options[d.rtype.selectedIndex].text == "CPU") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Memory") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Temperature") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "RTT") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
}

function nim_rt_set_generic(d)
{
   if (d.rtype.options[d.rtype.selectedIndex].text == "CPU") {
      d.db_type.selectedIndex = 0;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Memory") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 0;
      d.graph_type.selectedIndex = 1;
   }
   else if (d.rtype.options[d.rtype.selectedIndex].text == "Temperature") {
      d.db_type.selectedIndex = 1;
      d.interval.selectedIndex = 4;
      d.graph_type.selectedIndex = 1;
   }
}

function nim_rt_set(d)
{
   var re = new RegExp("_device");

   if (d.mode.value == "ping") {
      nim_rt_set_ping(d);
   }
   else if (d.mode.value == "if") {
      nim_rt_set_interface(d);
   }
   else if (d.mode.value == "fr") {
      nim_rt_set_interface(d);
   }
   else if (d.mode.value == "cisco_device") {
      nim_rt_set_cisco(d);
   }
   else if (d.mode.value == "cisco_ipsla") {
      nim_rt_set_cisco(d);
   }
   else if (d.mode.value == "server") {
      nim_rt_set_servers(d);
   }
   else if (d.mode.value.match(re)) {
      nim_rt_set_generic(d);
   }
}

function odv(t)
{
   url = '/cgi/nim-dv-ctl?device=' + encodeURIComponent(t.innerHTML);
   tz = getUrlVars()["tz"];
   if (tz != null) {
      url += "&tz=" + tz;
   }
   top_n = getUrlVars()["top_n"];
   if (top_n != null) {
      url += "&top_n=" + top_n;
   }
   options = 'scrollbars=no,resizable=yes,toolbar=no,menubar=no,width=1024,height=750';
   target = Math.round(Math.random() * 100000);
   window.open(url, target, options);
   return false;
}


function opv(dev, ifIndex)
{
   var cururl = document.URL;
   var pattern = /tz=[a-zA-Z_\/\-+0-9\%]*/;
   var tz = '';

   if (cururl.search(pattern) != -1) {
      var match = pattern.exec(cururl);
      tz = '&' + match[0];
   }

   return lastn_dd('mode=if&device=' + dev + '&ifIndex=' + ifIndex + '&type=all' + tz + '&last_n=12h');
}


/*
 * Custom data details report
 */

function change_table(val)
{
   change_url_param('table', val, 'sort', '');
}


function entity_polling_callback(response)
{
   var result = JSON.parse(response);

   var elem = document.getElementsByTagName('INPUT');
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].type === 'button') {
         elem[i].disabled = false;
      }
   }

   if (!result.success) {
      alert(result.reason);
   }
   else {
      window.location.reload(true);
   }
}


function toggle_entity_polling(id, state)
{
   var elem, table, name, state;

   elem = document.getElementById('table_selection');
   table = elem.options[elem.selectedIndex].value;

   ajax_post("/cgi/nim-report-cdt-info", 'action=pollstate&table=' + table + '&state=' + state + '&name=' + id, entity_polling_callback);
}


function toggle_all_checkboxes(elem)
{
   var checkboxes = document.getElementsByName('onoffbox');
   for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = elem.checked;
   }
}


function disable_selected()
{
   var elem, table, checkboxes, i, names;

   checkboxes = document.getElementsByName('onoffbox');
   elem = document.getElementById('table_selection');
   table = elem.options[elem.selectedIndex].value;
   names = [];

   for (i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
         continue;
      }
      names.push(checkboxes[i].nextElementSibling.value);
   }

   if (names.length > 0) {
      elem = document.getElementsByTagName('INPUT');
      for (i = 0; i < elem.length; i++) {
         if (elem[i].type === 'button') {
            elem[i].disabled = true;
         }
      }
      ajax_post("/cgi/nim-report-cdt-info", 'action=pollstate&table=' + table + '&state=disabled&name=' + names.join('&name='), entity_polling_callback);
   }
}


function delete_selected()
{
   var elem, table, checkboxes, i, names;

   if (!confirm('Note: Deleted entities will be rediscovered - to stop polling/display of entities, disable them instead.\n\nDeleted entities will lose all historical data, are you sure you wish to continue?')) {
      return false;
   }

   checkboxes = document.getElementsByName('onoffbox');
   elem = document.getElementById('table_selection');
   table = elem.options[elem.selectedIndex].value;
   names = [];

   for (i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
         continue;
      }
      names.push(checkboxes[i].nextElementSibling.value);
   }

   if (names.length > 0) {
      elem = document.getElementsByTagName('INPUT');
      for (i = 0; i < elem.length; i++) {
         if (elem[i].type === 'button') {
            elem[i].disabled = true;
         }
      }
      ajax_post("/cgi/nim-report-cdt-info", 'action=pollstate&table=' + table + '&state=deleted&name=' + names.join('&name='), entity_polling_callback);
   }
}


function enable_selected()
{
   var elem, table, checkboxes, i, names;

   checkboxes = document.getElementsByName('onoffbox');
   elem = document.getElementById('table_selection');
   table = elem.options[elem.selectedIndex].value;
   names = [];

   for (i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
         continue;
      }
      names.push(checkboxes[i].nextElementSibling.value);
   }

   if (names.length > 0) {
      elem = document.getElementsByTagName('INPUT');
      for (i = 0; i < elem.length; i++) {
         if (elem[i].type === 'button') {
            elem[i].disabled = true;
         }
      }
      ajax_post("/cgi/nim-report-cdt-info", 'action=pollstate&table=' + table + '&state=enabled&name=' + names.join('&name='), entity_polling_callback);
   }
}

