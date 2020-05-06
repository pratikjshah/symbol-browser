/*
 * Copyright 2019 Pratik Shah
 * 
 * Below code has been modified by Pratik Shah. Original by Roman Nurik 
 * 
 *     http://pratikshah.website
 * 
 * This is Licensed under the MIT License.
 * Along with previous the Apache License, Version 2.0 (the "License");
 *
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

if (!global._babelPolyfill) {
	require('babel-polyfill');
}

import {StickersUI} from './stickers-ui.js';
import * as util from './util';
import * as handler from './handler';

export function onShowStickers(context) {
	handler.init(context);
	let window = new StickersUI(context);
	window.showHide();
	handler.trackEvent("Stickers", "onShowHideStickers", 1);
}

export function onClearCache(context) {
	handler.init(context);
	util.rmdirRecursive(util.getPluginCachePath());
	context.document.showMessage(`✅ Symbol index cleared`);
	handler.trackEvent("Stickers", "onClearCache", 1);
}
