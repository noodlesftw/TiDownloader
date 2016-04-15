# TiDownloader

[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png)](http://wtfpl.net/)

A CommonJS module for Titanium to easily download files with a progress bar.

## Usage

Place `TiDownloader.js` in your `lib` folder and require it in your controller:

```javascript
// TiDownloader
var TiDownloader = require('TiDownloader');
```

Create an instance of the module:

```javascript
// The module adds a progressbar to the window you pass to the constructor.
// You can also pass a background color and progress color to control the look
// of the progressbar.
var imageDownloader = new TiDownloader($.index, '#3E4650', '#FFFFFF');
```

Set the download options:

```javascript
// Download options
var downloadOptions = {
  url: 'http://download.thinkbroadband.com/10MB.zip',
  filename: 'NameToSaveAs.zip'
};
```

Eventually start the download by calling the `download` method passing the download options and a callback function. The callback function receives the  `path`  to the downloaded file:

```javascript
imageDownloader.download(downloadOptions, function(err, path) {
  // If an error occurs while downloading the file, err holds
  // an object with details about the error. Otherwise err will
  // be null.
  if (err) {
  	Ti.API.info(err);
  	alert(err.error);
  }

  // Call the cleanup function (removes all views from the window)
  imageDownloader.cleanup();

  // null some variables
  imageDownloader = null;
  downloadOptions = null;

  // Do something with the file
  someFunction(path);
});
```
