/*
 * All software Copyright 2021 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */
var onhashtagchange = undefined;

var utils_tabs_nohistory = 0;

var menu_modes = [
   {
      'name': 'menu',
      'hashid': 'menuitem',
      'target': 'menutarget',
      'floats': 'floatmeleft',
      'float_sel': 'floatmeleftsel'
   },
   {
      'name': 'menu2',
      'hashid': 'menuitem2',
      'target': 'd_dashboards',
      'floats': 'floatmeleftv2',
      'float_sel': 'floatmeleftselv2'
   }
];


/* This needs to be run on-load*/
function disable_only_sel(mode) {
   if (mode == null)
      mode = 0;

   var elem = document.getElementById(menu_modes[mode].name);
   if (elem == null) {
      return;
   }
   var divs = elem.getElementsByTagName("LI");

   if (divs.length === 0)
      divs = document.getElementById(menu_modes[mode].name).getElementsByTagName("DIV");

   var i = divs.length;
   while (i--) {
      var d = divs[i];
      if (d == null)
         continue;
      d.onselectstart = function () {return false;};
      d.unselectable = 'on';
      d.style.MozUserSelect = 'none';
      d.style.cursor = 'pointer';
   }
}


function disable_sel(default_id, mode) {
   if (mode == null)
      mode = 0;
   disable_only_sel(mode);
   var val = get_urlhash_value(menu_modes[0].hashid);
   if (val)
      showme(val);
   else if (default_id)
      showme(default_id);
}

var oldsel = [];

function showme(id, mode) {
   if (mode == null)
      mode = 0;

   var d;

   if (oldsel[mode] != null) {
      oldsel[mode].style.visbility = 'hidden';
      oldsel[mode].style.display = 'none';
      d = document.getElementById('m' + oldsel[mode].id);
      if (d) {
         d.className = menu_modes[mode].floats;
      }
   }
   d = document.getElementById(id);
   if (d == null)
      return;
   d.style.visibility = 'visible';
   d.style.display = 'block';
   var e = document.getElementById('m' + id);
   if (e) {
      e.className = menu_modes[mode].floats + ' ' + menu_modes[mode].float_sel;
   }
   oldsel[mode] = d;
   if (utils_tabs_nohistory)
      set_urlhash_value_nohistory(menu_modes[mode].hashid, id);
   else
      set_urlhash_value(menu_modes[mode].hashid, id);
}

