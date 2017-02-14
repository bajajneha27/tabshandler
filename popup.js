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

    for (var i = 0; i < numberOfTabs; i++) {
      var div = document.createElement('div');
      var a = document.createElement('a');
      var closeMe = document.createElement('span');
      closeMe.className = "closeTab"
      closeMe.innerHTML = '  x';
      a.href = allTabs[i].url;
      a.innerHTML = allTabs[i].title;
      a.name = "tabsLink"
      div.id = allTabs[i].id;
      div.className = 'content'
      a.addEventListener('click', openTheTab, false);
      closeMe.addEventListener('click', closeTheTab, false);
      div.appendChild(a);
      div.appendChild(closeMe);
      document.getElementsByClassName('dropdown-menu')[0].appendChild(div);
    }
  });
});


function openTheTab(e){
  if(e.target.tagName == 'A' && e.target.name == 'tabsLink'){
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
