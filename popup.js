// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.addEventListener('DOMContentLoaded', function() {
  getAllTabs(function(allTabs) {
    numberOfTabs = allTabs.length;
    $("#container").append("<ul id='dropdown-menu'></ul>");
    ul = $("#dropdown-menu");

    for (var i = 0; i < numberOfTabs; i++) {
      li = document.createElement('li');
      li.id = allTabs[i].id;
      li.className = 'content';

      img = document.createElement('img');
      img.src = allTabs[i].favIconUrl;
      img.className = "tabIcon"

      a = document.createElement('a');
      a.innerHTML = allTabs[i].title;
      a.className = 'tabsLink';
      a.addEventListener('click', openTheTab, false);

      closeMe = document.createElement('span');
      closeMe.className = "closeTab"
      closeMe.addEventListener('click', closeTheTab, false);

      li.appendChild(img);
      li.appendChild(closeMe);
      $(li).append($('<span class="parent"/>').append(a));
      ul.append(li);
    }
  });

  $('#container').on('mouseenter', 'a', function() {
      var ulWidth = $(this).width();
      var liWidth = $(this).parent().parent().width() - 60;
      if(ulWidth > liWidth)$(this).parent().stop().animate({left: liWidth - ulWidth}, 1000, 'linear');
  }).on('mouseleave', 'a', function () {
      $(this).parent().stop().animate({left: 0}, 'medium', 'swing');
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
        id = tab.id;
        url = tab.url;
        chrome.tabs.remove(id);
        document.getElementById(id).innerHTML = "Closed. <a id='"+id+"' url='"+url+"'>Reopen</a>";
        document.getElementById(id).addEventListener('click', reopenTheTab, false);
      }
    });
  }
}

function getClosedTab(callback){
  chrome.sessions.getRecentlyClosed({maxResults: 1}, function(tabs) {
    callback(tabs);
  });
};

function reopenTheTab(e){
  getClosedTab(function(tabs) {
    sessionId = tabs[0].tab.sessionId;
    chrome.sessions.restore(sessionId,function(restoredTab){
      callback(restoredTab);
    });
  });
};


function getTab(tabId, callback){
  chrome.tabs.get(tabId, function(tab) {
    callback(tab);
  });
}

function getAllTabs(callback) {
  var queryInfo = {};

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs);
  });
}
