var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/timers/immediate.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/timers/immediate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")

function setImmediate(func, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  return timeout.setTimeout(func, 0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
}

function clearImmediate(id) {
  return timeout.clearTimeout(id)
}

module.exports = {
  setImmediate: setImmediate,
  clearImmediate: clearImmediate
}


/***/ }),

/***/ "./node_modules/@skpm/timers/index.js":
/*!********************************************!*\
  !*** ./node_modules/@skpm/timers/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")
var interval = __webpack_require__(/*! ./interval */ "./node_modules/@skpm/timers/interval.js")
var immediate = __webpack_require__(/*! ./immediate */ "./node_modules/@skpm/timers/immediate.js")

module.exports = {
  setTimeout: timeout.setTimeout,
  clearTimeout: timeout.clearTimeout,
  setImmediate: immediate.setImmediate,
  clearImmediate: immediate.clearImmediate,
  setInterval: interval.setInterval,
  clearInterval: interval.clearInterval
}


/***/ }),

/***/ "./node_modules/@skpm/timers/interval.js":
/*!***********************************************!*\
  !*** ./node_modules/@skpm/timers/interval.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals coscript, sketch */
var fibers = []

var setInterval = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  // fibers takes care of keeping coscript around
  var id = fibers.length
  fibers.push(coscript.scheduleWithRepeatingInterval_jsFunction(
    (delay || 0) / 1000,
    function () {
      func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
    }
  ))
  return id
}

var clearInterval = function (id) {
  var interval = fibers[id]
  if (interval) {
    interval.cancel() // fibers takes care of keeping coscript around
    fibers[id] = undefined // garbage collect the fiber
  }
}

module.exports = {
  setInterval: setInterval,
  clearInterval: clearInterval
}


/***/ }),

/***/ "./node_modules/@skpm/timers/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/@skpm/timers/timeout.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals coscript */
var fibers = []

var setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  // fibers takes care of keeping coscript around
  var id = fibers.length
  fibers.push(coscript.scheduleWithInterval_jsFunction(
    (delay || 0) / 1000,
    function () {
      func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
    }
  ))
  return id
}

var clearTimeout = function (id) {
  var timeout = fibers[id]
  if (timeout) {
    timeout.cancel() // fibers takes care of keeping coscript around
    fibers[id] = undefined // garbage collect the fiber
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),

/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/*! exports provided: onAction, onOpenDocument, checkForUpdate, openDocumentation, openSampleFile, reportIssue, aboutPratikShah, manageDailyUpdateCheck, manageManualUpdate, manageUpdate, init, showMsg, openUrlInBrowser, saveLocalData, readLocalData, networkRequest, trackEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onAction", function() { return onAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onOpenDocument", function() { return onOpenDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkForUpdate", function() { return checkForUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openDocumentation", function() { return openDocumentation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openSampleFile", function() { return openSampleFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportIssue", function() { return reportIssue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aboutPratikShah", function() { return aboutPratikShah; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageDailyUpdateCheck", function() { return manageDailyUpdateCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageManualUpdate", function() { return manageManualUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageUpdate", function() { return manageUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showMsg", function() { return showMsg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openUrlInBrowser", function() { return openUrlInBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveLocalData", function() { return saveLocalData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readLocalData", function() { return readLocalData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networkRequest", function() { return networkRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackEvent", function() { return trackEvent; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Copyright 2019 Pratik Shah
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

var globalContext;
var remoteManifestUrl = "https://raw.githubusercontent.com/pratikjshah/symbol-browser/master/symbol-browser.sketchplugin/Contents/Sketch/manifest.json";
var localDataPath;
var userConfig;
var pluginRoot;
var hasResponseCame = false;

var timeout = __webpack_require__(/*! @skpm/timers */ "./node_modules/@skpm/timers/index.js"); // ===== Menu action handlers ========================


function onAction(context) {// console.log("Action: " + context.action);
}
function onOpenDocument(context) {
  globalContext = context;
  init(context);
  networkRequest(remoteManifestUrl, manageDailyUpdateCheck);
  trackEvent("onAction", "onOpenDocument", 1);
}
function checkForUpdate(context) {
  init(context);
  networkRequest(remoteManifestUrl, manageManualUpdate);
  trackEvent("checkForUpdate", "manualCheckForUpdate", 1); // context.document.showMessage("remoteManifest: " + remoteManifest.version);
} // ===== Other functions ==========================

function openDocumentation(context) {
  init(context);
  openUrlInBrowser("http://symbol-browser.pratikshah.website/#faq");
}
function openSampleFile(context) {
  init(context);
  openUrlInBrowser("https://sketch.cloud/s/DVnWq");
}
function reportIssue(context) {
  init(context);
  openUrlInBrowser("https://github.com/pratikjshah/symbol-browser/issues");
}
function aboutPratikShah(context) {
  init(context);
  openUrlInBrowser("http://pratikshah.website");
}
function manageDailyUpdateCheck(remoteManifest) {
  var isDailyCheck = true;
  manageUpdate(remoteManifest, isDailyCheck);
}
function manageManualUpdate(remoteManifest) {
  var isDailyCheck = false;
  manageUpdate(remoteManifest, isDailyCheck);
}
function manageUpdate(remoteManifest, isDailyCheck) {
  // console.log("userConfig.localVersion: "+ userConfig.localVersion + "   |   remoteManifest.version: " + remoteManifest.version);

  /*if (userConfig.localVersion != remoteManifest.version) {
  	showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
  }*/
  var localVersion = globalContext.plugin.version();

  if (remoteManifest.version) {
    if (localVersion === remoteManifest.version) {
      if (!isDailyCheck) {
        showMsg("🤘Yo🤘! You are using the latest version of " + remoteManifest.name);
      }

      setUpdateCheckDayOnTomorrow();
    } else {
      showMsg("Hey👋! New version of " + remoteManifest.name + " is available!"); //showAvailableUpdateDialog();

      setUpdateCheckDayOnTomorrow();
    }
  } else {
    //showMsg("can not check:");
    //showAvailableUpdateDialog();
    setUpdateCheckDayOnTomorrow();
  }
}

function setUpdateCheckDayOnTomorrow() {
  var newTime = new Date();
  newTime.setDate(newTime.getDate() + 1);
  userConfig.localUpdateTime = newTime.getTime();
  saveLocalData(userConfig, localDataPath);
} // ===== Dialog functions ==========================


function showAvailableUpdateDialog() {
  var window = createDownloadWindow();
  var alert = window[0]; // When “Ok” is clicked

  var response = alert.runModal();

  if (response == "1000") {
    //globalContext.document.showMessage("Go to download");
    openUrlInBrowser("https://github.com/pratikjshah/symbol-browser/releases/latest/download/symbol-browser.sketchplugin.zip");
  } else {
    //globalContext.document.showMessage("Check later");
    setUpdateCheckDayOnTomorrow();
  }
} // ===== Helper functions ==========================


function init(context) {
  globalContext = context;
  pluginRoot = globalContext.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
  localDataPath = pluginRoot + "/Contents/Resources/user.config";
  userConfig = readLocalData(localDataPath);
  var newTime = new Date();

  if (userConfig.localUpdateTime < newTime.getTime()) {
    trackEvent("checkForUpdate", "dailyCheckForUpdate", 1);
    networkRequest(remoteManifestUrl, manageDailyUpdateCheck);
  }
  /*var remoteManifest = getRemoteJson(remoteManifestUrl);
  if (userConfig.localVersion != remoteManifest.version) {
  showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
  }
  setUpdateCheckDayOnTomorrow();*/

}
function showMsg(msg) {
  globalContext.document.showMessage(msg);
}
function openUrlInBrowser(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
  trackEvent("openUrlInBrowser", url, 1);
}
function saveLocalData(data, path) {
  /*var string = [NSString stringWithFormat: "%@", JSON.stringify(data)];
  [string writeToFile: path atomically: true encoding: NSUTF8StringEncoding error: nil];*/
  data = JSON.stringify(data);
  var text = NSString.stringWithFormat("%@", data);
  var file = NSString.stringWithFormat("%@", path);
  return text.writeToFile_atomically_encoding_error(file, true, NSUTF8StringEncoding, null);
}
function readLocalData(path) {
  if (NSFileManager.defaultManager().fileExistsAtPath(path)) {
    var string = NSString.stringWithContentsOfFile_encoding_error(path, 4, nil);
    string = string.replace(/(\r\n|\n|\r)/gm, "");
    var data = JSON.parse(string);
    return data;
  }
}
function networkRequest(url, callBackFun) {
  /*
  // console.log("in networkRequest: \n" + url + " \n " + callBackFun);
  return fetch(url)
   .then(function (response) {
  	  if (!response.ok) {
  	    throw Error(response.statusText);
  	  }
  	  return response;
  	})
   .then(function (response) {
  	  return response.json();
  	})
   .then(function (result) {
  	  console.log('Response Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
  	  console.log(result);
  	  if(callBackFun !== 'undefined') {
  	  	callBackFun(result);
  	  }
  	  return result;
  	})
   .catch(function (error) {
  	  console.log('Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
  	  console.log('Looks like there was a problem: \n', error);
  	});
     */
  try {
    var url = NSURL.URLWithString("" + url);
    var data = NSData.dataWithContentsOfURL(url);
    var json = NSJSONSerialization.JSONObjectWithData_options_error(data, 0, nil); // log("parsed data / json");
    // log(json);
    // console.log('Params: \n url: ' + url + " \n callBackFun: " + callBackFun);

    callBackFun(json);
  } catch (e) {
    log("Exception: " + e);
  }
}
function trackEvent(action, label, value) {
  /*
  var kUUIDKey = 'google.analytics.uuid'
  var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
  if (!uuid) {
    uuid = NSUUID.UUID().UUIDString()
    NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
  }
   var tid = "UA-64818389-8";
  var cid = uuid;
  var ds = "Sketch-" + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString");
  var baseURL = "https://www.google-analytics.com/debug/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
  baseURL = "https://www.google-analytics.com/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
  var version = context.plugin.version().UTF8String();
   var trackingURL = baseURL + "&ec=SketchSymbolBrowser-" + version + "&ea=" + action + "&el=" + label + "&ev=" + value;
  // networkRequest(trackingURL);
  */
  // console.log("globalContext");
  // console.log(globalContext);
  var trackingID = "UA-64818389-8";
  var userDefaults = NSUserDefaults.standardUserDefaults();
  var uuidKey = "google.analytics.uuid";
  var uuid = userDefaults.objectForKey(uuidKey);

  if (!uuid) {
    uuid = NSUUID.UUID().UUIDString();
    userDefaults.setObject_forKey(uuid, uuidKey);
    userDefaults.synchronize();
  }

  var appName = encodeURI(globalContext.plugin.name()),
      appId = globalContext.plugin.identifier(),
      appVersion = globalContext.plugin.version();
  var url = "https://www.google-analytics.com/collect?v=1"; // Tracking ID

  url += "&tid=" + trackingID; // Source

  url += "&ds=sketch" + MSApplicationMetadata.metadata().appVersion; // Client ID

  url += "&cid=" + uuid; // User GEO location

  url += "&geoid=" + NSLocale.currentLocale().countryCode(); // User language

  url += "&ul=" + NSLocale.currentLocale().localeIdentifier().toLowerCase(); // pageview, screenview, event, transaction, item, social, exception, timing

  url += "&t=event"; // App Name

  url += "&an=" + appName; // App ID

  url += "&aid=" + appId; // App Version

  url += "&av=" + appVersion; // Event category

  url += "&ec=" + encodeURI("SketchSymbolBrowser-" + appVersion); // Event action
  // url += "&ea=" + encodeURI(eventAction);

  url += "&ea=" + encodeURI(action); // Event label
  // if (eventLabel) {
  //     url += "&el=" + encodeURI(eventLabel);
  // }

  url += "&el=" + encodeURI(label); // Event value
  // if (eventValue) {
  //     url += "&ev=" + encodeURI(eventValue);
  // }

  url += "&ev=" + encodeURI(value); // console.log("new ga url: " + url);

  var session = NSURLSession.sharedSession();
  var task = session.dataTaskWithURL(NSURL.URLWithString(NSString.stringWithString(url)));
  task.resume();
}

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onOpenDocument'] = __skpm_run.bind(this, 'onOpenDocument');
that['onRun'] = __skpm_run.bind(this, 'default');
that['openDocumentation'] = __skpm_run.bind(this, 'openDocumentation');
that['openSampleFile'] = __skpm_run.bind(this, 'openSampleFile');
that['reportIssue'] = __skpm_run.bind(this, 'reportIssue');
that['checkForUpdate'] = __skpm_run.bind(this, 'checkForUpdate');
that['aboutPratikShah'] = __skpm_run.bind(this, 'aboutPratikShah')

//# sourceMappingURL=handler.js.map