// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function getAllTabs(callback) {
  var queryInfo = {};

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getAllTabs(function(allTabs) {
    numberOfTabs = allTabs.length;
    $("#container").append("<ul id='dropdown-menu'></ul>");
    ul = $("#dropdown-menu");

    for (var i = 0; i < numberOfTabs; i++) {
      li = document.createElement('li');
      li.id = allTabs[i].id;
      li.className = 'content';

      a = document.createElement('a');
      a.innerHTML = allTabs[i].title;
      a.className = 'tabsLink';
      a.addEventListener('click', openTheTab, false);

      closeMe = document.createElement('span');
      closeMe.className = "closeTab"
      closeMe.innerHTML = 'x';
      closeMe.addEventListener('click', closeTheTab, false);
      
      li.appendChild(closeMe);
      li.appendChild(a);
      ul.append(li);
    }
  });
});


function openTheTab(e){
  if(e.target.tagName == 'A' && e.target.className == 'tabsLink'){
    getTab(parseInt(e.target.parentNode.id), function(tab){
      if(tab){
        chrome.tabs.update(tab.id, {selected: true});
      }
    });
  }
}

function closeTheTab(e){
  if(e.target.tagName == 'SPAN' && e.target.className == 'closeTab'){
    getTab(parseInt(e.target.parentNode.id), function(tab){
      if(tab){
        chrome.tabs.remove(tab.id);
        document.getElementById(tab.id).remove();
      }
    });
  }
}

function getTab(tabId, callback){
  chrome.tabs.get(tabId, function(tab) {
    callback(tab);
  });
}
