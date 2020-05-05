/*
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// trigger copying of related assets
require('file-loader?name=[name].[ext]!./index.html');

// libraries
import * as $ from 'jquery';
import Vue from 'vue';

import ElementVisibility from './lib/element-visibility';
import StickersClient from './client';


// load icons
const requireAll = r => r.keys().map(r);
requireAll(require.context('!svg-sprite-loader!./icons/', false, /.*\.svg$/))
    .map(m => m.default)
    .reduce((acc, icon) => ({
      ...acc,
      [icon.id]: icon
    }), {});


// consts
const MAX_DRAW_WIDTH = 300;
const MAX_DRAW_HEIGHT = 400;


var typingTimer = null;
var doneTypingInterval = 1000;


// page controller
class StickersPage {
  constructor() {
    this.setupCoreUi();
    this.setupStickersUi();
    StickersClient.init();
    StickersClient.on('load-progress', f => this.vue.indexLoadProgress = f);
    StickersClient.once('loaded', rawStickerIndex => {
      this.vue.stickerIndex = this.processRawStickerIndex(rawStickerIndex);
      this.vue.$nextTick(() => {
        // $('.header-area__search-field').focus();
        if($('*[data-key="'+localStorage.getItem('activeLibrary')+'"]') == null) {
          $('*[data-key="all"]').click();
        } else {
          $('*[data-key="'+localStorage.getItem('activeLibrary')+'"]').click();
        }
        this.loadVisibleStickers();
        if(localStorage.getItem('hasUpdates') !== null && localStorage.getItem('hasUpdates') == true) {
          $(document.body).addClass('hasUpdates');
        }
      });
    });
  }

  processRawStickerIndex(stickerIndex) {

    stickerIndex.libraries = stickerIndex.libraries
        .filter(lib => !!lib.sections.length);

    if(stickerIndex.libraries.length <= 1) {
      $(document.body).addClass('hide-navigation');
    }

    for (let library of stickerIndex.libraries) {
      for (let section of library.sections) {
        section.rows = [];
        let currentRow = null;

        let newRow = () => {
          currentRow = {items: []};
          section.rows.push(currentRow);
        };

        for (let item of section.items) {
          if (item.layout == 'row') {
            newRow();
            currentRow.items.push(item);
            newRow();
          } else {
            if (!currentRow) {
              newRow();
            }
            currentRow.items.push(item);
          }
        }
      }
    }

    return stickerIndex;
  }

  setupCoreUi() {
    $(document.body).attr('ui-mode',
        (window.location.search.match(/uiMode=(\w+)/) || [])[1] || 'cover');

    if (window.location.search.match(/darkMode=1/)) {
      $(document.body).attr('is-dark-theme', '1');
    }

    $(document).on('contextmenu', e => e.preventDefault());
    $(document).on('click', 'a[href]', ev => {
      let url = $(ev.target).attr('href');
      StickersClient.openUrl(url);
      ev.preventDefault();
    });

    // setupSearchHistoryList();

    var me = this;

    this.vueGlobal = new Vue({
      data: {
        searchText: '',
        anyResults: false
      },
    });

    Vue.prototype.$globals = this.vueGlobal;

    function hiliteReplacer_() {
      return Array.from(arguments).slice(1, -2)
          .map((s, i) => i % 2 == 0
              ? `<span class="search-highlight">${s}</span>`
              : s)
          .join('');
    }

    Vue.component('hilitext', {
      template: `<div v-html="highlight(text, $globals.searchText)"></div>`,
      props: ['text'],
      methods: {
        highlight: (text, query) => {
          if (!query) {
            return text;
          }

          return String(text || '').replace(this.regexForSearchText(query), hiliteReplacer_);
        }
      }
    });

    Vue.component('svg-icon', {
      template: `<svg class="svg-icon"><use :xlink:href="'#' + glyph" /></svg>`,
      props: ['glyph'],
    });

    Vue.component('sticker', {
      props: ['sticker', 'parentSection'],
      template: '#sticker-template',
      computed: {
        drawSize() {
          return me.calcDrawSize(this.sticker);
        }
      },
    });

    this.vue = new Vue({
      el: '.root',
      data: {
        indexLoadProgress: 0,
        stickerIndex: null,
      },
      methods: {
        addLibraryColors(library) {
          StickersClient.addLibraryColors(library.id);
          library.colorsAdded = true;
        },
        closeWindow() {
          // StickersClient.close();
        },
        onSearchKeydown(ev) {
          if (ev.keyCode == 27) {
            if (ev.target.value) {
              ev.preventDefault();
              me.vueGlobal.searchText = '';
              me.updateSearch();
            }
          }
          // clearTimeout(typingTimer);
        },
        onSearchKeyup(ev) {
          // clearTimeout(typingTimer);
          // typingTimer = setTimeout( function() {
          //   updateSearchHistory(me.vueGlobal.searchText)
          // }, doneTypingInterval);
        },
        onSearchInput(ev) {
          $(window).scrollTop(0);
          me.updateSearch();
          // clearTimeout(ev._timer);
          // ev._timer = setTimeout(()=>{
          //   me.updateSearchHistory();
          // }, 500);
        },
      },
    });
  }

  regexForSearchText(query) {
    return new RegExp((query || '')
        .replace(/^\s+|\s+$/g, '')
        .split(/\s+/)
        .map(s => `(${s})`)
        .join('(.*?)'), 'ig');
  }

  updateSearch() {
    
    let query = this.vueGlobal.searchText;
    localStorage.setItem("query", query);

    // TODO: move this to a watcher in vueGlobal
    this.vue.$nextTick(() => {
      const re = this.regexForSearchText(query);

      // if(query.length < 1) {
      //   console.log("Clear search and go back to selected tab");
      // }


      const findIn = s => this.vueGlobal.searchText ? (s || '').search(re) >= 0 : true;

      const visitItem = item => {
        let found = false;
        if (item.items) {
          // section
          for (const subItem of item.items) {
            if (visitItem(subItem)) {
              found = true;
            }
          }
          if (findIn(item.title) || findIn(item.description)) {
            found = true;
            visitUnhide(item);
          }

        } else {
          // sticker
          found = findIn(item.name);
        }

        item._hide = !found;
        return found;
      };

      const visitUnhide = item => {
        if (item.items) {
          for (const subItem of item.items) {
            visitUnhide(subItem);
          }
        }

        item._hide = false;
      };

      let anyResults = false;
      let selectedLibraries = this.vue.stickerIndex.libraries;
      let searchableLibraries;
      let activeLibrary = localStorage.getItem('activeLibrary');
      localStorage.setItem("beforeSearchActiveLibrary", activeLibrary);

      // console.log("selectedLibraries");
      // console.log(selectedLibraries);
      // console.log("activeLibrary");
      // console.log(activeLibrary);

      if (activeLibrary !== 'all') {
        searchableLibraries = selectedLibraries.filter(obj => {
          return obj.id == activeLibrary
        });
      } else {
        searchableLibraries = selectedLibraries;
      }

      for (const library of searchableLibraries) {
        let foundInLibrary = false;
        for (const section of library.sections) {
          let found;
          for (const row of section.rows) {
            if (visitItem(row)) {
              found = true;
            }
          }
          if (findIn(section.title) || findIn(section.description)) {
            found = true;
            for (const row of section.rows) {
              visitUnhide(row);
            }
          }
          section._hide = !found;
          anyResults = anyResults || found;
          foundInLibrary = foundInLibrary || found;
        }
        library._hide = !foundInLibrary;
      }

      if (typeof anyResults === 'undefined') {
        anyResults = false;
      }

      this.vueGlobal.anyResults = anyResults;

      this.vue.$forceUpdate();
      $(document.body).toggleClass('has-active-search', (!!this.vueGlobal.searchText && anyResults));
      $(document.body).toggleClass('no-search-results', !anyResults);
      this.vue.$nextTick(() => {
        this.loadVisibleStickers();
      });
    });
  }

  calcDrawSize(sticker) {
    // fit the sticker into a max width and height, keeping its aspect ratio
    let size = { width: sticker.width, height: sticker.height };
    if (size.width > MAX_DRAW_WIDTH) {
      size.height = size.height * MAX_DRAW_WIDTH / size.width;
      size.width = MAX_DRAW_WIDTH;
    }
    if (size.height > MAX_DRAW_HEIGHT) {
      size.width = size.width * MAX_DRAW_HEIGHT / size.height;
      size.height = MAX_DRAW_HEIGHT;
    }
    return size;
  }

  setupStickersUi() {
    $(document).on('mousedown', '.sticker__thumb', ev => {
      let stickerId = $(ev.target).parents('.sticker').attr('data-sticker-id');
      let rect = $(ev.target).get(0).getBoundingClientRect();
      rect = {
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
      StickersClient.startDragging(stickerId, rect);
    });

    if(localStorage.getItem('activeLibrary') == null) {
      localStorage.setItem("activeLibrary", 'all');
    }

    if(localStorage.getItem('beforeSearchActiveLibrary') == null) {
      localStorage.setItem("beforeSearchActiveLibrary", 'all');
    }

    $(document).on('click', '.library-tab', ev => {
      $(ev.target).addClass('active');
      $(ev.target).siblings().removeClass('active');

      var key = $(ev.target).attr('data-key');
      var libraryContainer = '.sticker-library-container';

      localStorage.setItem("activeLibrary", key);

      if(key === 'all') {
        $(libraryContainer).show();
      } else {
        $('#' + key + libraryContainer).show();
        $('#' + key + libraryContainer).siblings().hide();
      }
      window.scrollTo({top: 0, behavior: 'smooth'});
      
      //$('.autocomplete').focus();
      if($(document.body).hasClass('no-search-results')) {
        $(document.body).removeClass('no-search-results');
      }
      // this.vueGlobal.searchText = $('.header-area__search-field').value;
      this.updateSearch();

    });

    this.setupStickerImageLoading();
  }

  setupStickerImageLoading() {
    this.loadVisibleStickers();
    $(window).on('DOMContentLoaded load resize', () => this.loadVisibleStickers());
    window.addEventListener('scroll', () => this.loadVisibleStickers(), true); // true == capture (all elements)
  }

  loadVisibleStickers() {
    this.fetchedImages = this.fetchedImages || new Set();
    $('.sticker').each((index, el) => {
      let $el = $(el);
      let stickerId = $el.attr('data-sticker-id');
      if ($el.attr('data-loaded')) {
        return;
      }

      if (!ElementVisibility.isElementInViewport(el)) {
        return;
      }

      this.fetchedImages.add(stickerId);
      StickersClient.getStickerImageUrl(stickerId).then(url => {
        $el.find('.sticker__thumb').attr('src', url).one('load', () => {
          $el.attr('data-loaded', true);
        });
      });
    });
  }
}

function updateSearchHistory(searchTerm) {
  // console.log("searchText: " + searchTerm);
  var localHistory = [];
  if (localStorage.getItem("searchHistory") !== null) {
    localHistory = JSON.parse(localStorage.getItem("searchHistory"));
  }
  if((!localHistory.includes(searchTerm)) && searchTerm.length > 3) {
    localHistory.push(searchTerm);
    addItemToSearchHistoryList(searchTerm);
  }
  localStorage.setItem("searchHistory", JSON.stringify(localHistory));
  // $("#log").val(JSON.stringify(localHistory));
}

function setupSearchHistoryList() {
  /* ======= setting up search history ========== */
  var localHistory = [];
  // localStorage.clear();
  if (localStorage.getItem("searchHistory") !== null) {
    localHistory = JSON.parse(localStorage.getItem("searchHistory"));
  }
  localHistory.forEach(function(item){
    addItemToSearchHistoryList(item);
  });
}

function addItemToSearchHistoryList(item) {
  var list = document.getElementById('searchHistory');
  var option = document.createElement('option');
     option.value = item;
     list.appendChild(option);
}

$(window).on('load', () => {
  new StickersPage();
});