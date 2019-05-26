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

import sketch from 'sketch'

var globalContext;
var remoteManifestUrl = "https://raw.githubusercontent.com/pratikjshah/symbol-browser/master/symbol-browser.sketchplugin/Contents/Resources/user.config";
var localDataPath;
var userConfig;
var pluginRoot;
var hasResponseCame = false;
const timeout = require('@skpm/timers');

// ===== Menu action handlers ========================

export function onAction(context) {
	// console.log("Action: " + context.action);
}

export function onOpenDocument(context) {
	init(context);
    networkRequest(remoteManifestUrl, manageDailyUpdateCheck);
    trackEvent("onAction", "onOpenDocument", 1);
}

export function checkForUpdate(context) {
	init(context);
    networkRequest(remoteManifestUrl, manageManualUpdate);
    trackEvent("checkForUpdate", "manualCheckForUpdate", 1);
    // context.document.showMessage("remoteManifest: " + remoteManifest.version);
}

// ===== Other functions ==========================

export function openDocumentation(context) {
	init(context);
    openUrlInBrowser("http://symbol-browser.pratikshah.website/#faq");
}

export function openSampleFile(context) {
	init(context);
    openUrlInBrowser("https://sketch.cloud/s/DVnWq");
}

export function reportIssue(context) {
	init(context);
    openUrlInBrowser("https://github.com/pratikjshah/symbol-browser/issues");
}

export function aboutPratikShah(context) {
	init(context);
	openUrlInBrowser("http://pratikshah.website");
}

export function manageDailyUpdateCheck(remoteManifest) {
	var isDailyCheck = true;
	manageUpdate(remoteManifest, isDailyCheck);
}

export function manageManualUpdate(remoteManifest) {
	var isDailyCheck = false;
	manageUpdate(remoteManifest, isDailyCheck);
}

export function manageUpdate(remoteManifest, isDailyCheck) {
	// console.log("userConfig.localVersion: "+ userConfig.localVersion + "   |   remoteManifest.version: " + remoteManifest.version);

	/*if (userConfig.localVersion != remoteManifest.version) {
		showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
	}*/

    if (remoteManifest.localVersion) {
        if (userConfig.localVersion == remoteManifest.localVersion) {
        	if(!isDailyCheck) {
        		showMsg("🤘Yo🤘! You are using the latest version of " + userConfig.name);
        	}
          setUpdateCheckDayOnTomorrow();
        } else {
          showMsg("Hey👋! New version of " + userConfig.name + " is available!");
          //showAvailableUpdateDialog();
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
}

// ===== Dialog functions ==========================

function showAvailableUpdateDialog() {
  var window = createDownloadWindow();
  var alert = window[0];
  // When “Ok” is clicked
  var response = alert.runModal();
  if (response == "1000") {
    //globalContext.document.showMessage("Go to download");
    openUrlInBrowser("https://github.com/pratikjshah/symbol-browser/releases/latest/download/symbol-browser.sketchplugin.zip");
  } else {
    //globalContext.document.showMessage("Check later");
    setUpdateCheckDayOnTomorrow();
  }
}

// ===== Helper functions ==========================

export function init(context) {
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

export function showMsg(msg) {
	globalContext.document.showMessage(msg);
}

export function openUrlInBrowser(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
    trackEvent("openUrlInBrowser", url, 1);
}

export function saveLocalData(data, path) {
	/*var string = [NSString stringWithFormat: "%@", JSON.stringify(data)];
	[string writeToFile: path atomically: true encoding: NSUTF8StringEncoding error: nil];*/
	data = JSON.stringify(data);
	var text = NSString.stringWithFormat("%@", data);
	var file = NSString.stringWithFormat("%@", path);
	return text.writeToFile_atomically_encoding_error(file, true, NSUTF8StringEncoding, null);
}

export function readLocalData(path) {
  if(NSFileManager.defaultManager().fileExistsAtPath(path)){
    var string = NSString.stringWithContentsOfFile_encoding_error(path,4, nil);
    string = string.replace(/(\r\n|\n|\r)/gm,"");
    var data = JSON.parse(string);
    return data;
  }
}

export function networkRequest(url, callBackFun) {

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
			  // console.log('Response Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
			  // console.log(result);
			  if(callBackFun !== 'undefined') {
			  	callBackFun(result);
			  }
			  return result;
			})
	  .catch(function (error) {
			  // console.log('Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
			  // console.log('Looks like there was a problem: \n', error);
			});
}

export function trackEvent(action, label, value) {
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
    // var version = userConfig.localVersion;
    var version = context.plugin.version().UTF8String();

    var trackingURL = baseURL + "&ec=SketchSymbolBrowser-" + version + "&ea=" + action + "&el=" + label + "&ev=" + value;
    networkRequest(trackingURL);

}