# Sketch Symbol Browser

<img src="https://raw.githubusercontent.com/pratikjshah/symbol-browser/master/art/symbol-browser-logo.png" alt="Sketch Symbol Browser" width="160" align="right" />

Better way to browse your <b>Design System</b> and <b>UI Sticker sheet</b>. <br/>

This plugin lets you..
- Browse Sketch symbols
- Drag-N-Drop UI Kit / Stickers
- Add documentation to your Sketch Library
- `New` Share instances of the Symbol
- `New` Works offline

[![GitHub Release](https://github-basic-badges.herokuapp.com/release/pratikjshah/symbol-browser.svg)]()
[![GitHub Download Count](https://github-basic-badges.herokuapp.com/downloads/pratikjshah/symbol-browser/total.svg)]()
[![GitHub License](https://github-basic-badges.herokuapp.com/license/pratikjshah/symbol-browser.svg)]()

<div>
  <h4>
    <a href="https://github.com/pratikjshah/symbol-browser/releases/latest/download/symbol-browser.sketchplugin.zip">
      Download
    </a>
    <span> | </span>
    <a href="https://github.com/pratikjshah/symbol-browser/#faq">
      Help and FAQs
    </a>
  </h4>
</div>

## Installation Guide
- [⬇️Download](https://github.com/pratikjshah/symbol-browser/releases/latest/download/symbol-browser.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on the `symbol-browser.sketchplugin`

<br/>

## See it in action
<img src="https://raw.githubusercontent.com/pratikjshah/symbol-browser/master/art/symbol-browser-features.gif" alt="Symbol Browser Features image" width="100%" align="center" />

<br/>

## FAQ

<details><summary><b>Why is it taking so long for indexing?</b></summary>
<p>

Time required to index your Sketch Library is directly proportional to the size and number of symbols it has. But don't worry! This is a one time activity. 

*If you have suggestions on how can this be optimized, feel free to raise a pull request.*

</p>
</details>

<details><summary><b>My Library symbol update is not reflecting in Symbol Browser!</b></summary>
<p>

The plugin checks for the Sketch Library modification time and keeps indexing the change when you Open a new document or add a new Sketch Library. 

But in case you want to *force plugin to index again*, you can go to plugin menu and click `🧹 Clear Symbol Index` to remove cached symbols. So after this when you one the Symbol Browser, it will re-index Sketch Libraries.

![🧹 Clear Symbol Index](https://github.com/pratikjshah/symbol-browser/blob/master/art/clear-symbol-index.png?raw=true "🧹 Clear Symbol Index")

</p>
</details>

<details><summary><b>How is this plugin different from 'Stickers'?</b></summary>
<p>

**Symbol Browser** is a forked version of Roman Nurik's [Sticker](https://github.com/romannurik/Sketch-Stickers) project.
  The goal of this sketch plugin is to provide additional features such as showing Sketch Library symbols along with the Stickers you have tagged.
  
</p>
</details>

<br/><br/>



#### Contributing

Lots of room for improvement, let's build it together. Report an [`issue`](https://github.com/pratikjshah/symbol-browser/issues) or request for an exciting [`feature`](https://github.com/pratikjshah/symbol-browser/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

#### Credits and Acknowledgement

- Sketch [Developers API](https://developer.sketch.com/reference/api/)
- Roman Nurik for [Stickers](https://github.com/romannurik/Sketch-Stickers)
