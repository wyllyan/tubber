# [Tubber](http://wyllyan.github.io/tubber/)

A simple plugin that's able to show YouTube videos on your page. It's compatible with YouTube Data API (v3).

You can use it how you want. Feel free to let your feedback through the issues section. Of course, your code contribution too.

## Getting started

- This plugin requires jQuery 1.8.0 or higher.
- It will be necessary to get an API Key on [Google Developers Console](https://console.developers.google.com/). Detailed info here: https://developers.google.com/youtube/v3/getting-started.

### Basic usage

```javascript
$('#example1-container').tubber({
	apiKey: 'YOURDEVELOPERKEY',
	username: 'youtube',
	itemsPerPage: 1
});
```

If you have to use Tubber many times in a page (to show several galleries, for example), you can define the API key once for all calls:

```javascript
$.fn.tubber.defaults.apiKey = 'YOURDEVELOPERKEY';
```

## Examples

- [Click to view some use examples of Tubber](http://wyllyan.github.io/tubber/examples.html)

## Documentation

- [Options reference](Documentation.md#options-reference)
- [Events](Documentation.md#events)
