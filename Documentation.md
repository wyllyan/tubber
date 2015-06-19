# Documentation

This documentation will be reviewed yet.

## Options reference

| Option | Details |
| ------ | ------- |
| apiKey | **Type:** String<br>**Default value:** null<br>**Description:** You have to register your application and get an API Key on [Google Developers Console](https://console.developers.google.com/). Detailed info in https://developers.google.com/youtube/v3/getting-started. |
| playlistId | **Type:** String<br>**Default value:** null<br>**Description:** The identifier of the playlist you want to show. You can set the popular videos playlist of your country for example. |
| username | **Type:** String<br>**Default value:** null<br>**Description:** Setting it with a YouTube username, the uploads of this one will be show. If the option "playlistId" is defined, this option will be ignored. |
| channelId | **Type:** String<br>**Default value:** null<br>**Description:** Setting it with a YouTube channel identifier, the uploads of this one will be show. If the option "playlistId" or "username" is defined, this option will be ignored. |
| itemsPerPage | **Type:** Integer<br>**Default value:** 5<br>**Description:** The number of video items to show. |
| embedVideo | **Type:** Boolean<br>**Default value:** true<br>**Description:** If set to false, the video thumbnail will load insted of the embed video iframe. |
| embedVideoBaseUrl | **Type:** String<br>**Default value:** https://www.youtube.com/embed/<br>**Description:** The YouTube base URL used in embed video elements. |
| mediaViewer | **Type:** jQuery selector / Function<br>**Default value:** null<br>**Description:** Define the way how a selected video is showed (consider this option only if the option "embedVideo" be false). If kept it null, the YouTube video page will be opened. Or else, you can set a jQuery selection to an element who will load the embed iframe. But if you'd like to use another way like a modal viewer (eg.: Fancybox), you can set a function that will receive the video id as paramter. |
| watchVideoBaseUrl | **Type:** String<br>**Default value:** https://www.youtube.com/watch?v=<br>**Description:** The YouTube base URL to watch a video. |
| showVideoTitle | **Type:** Boolean<br>**Default value:** false<br>**Description:** Show or hide the video title. |
| showVideoDescription | **Type:** Boolean<br>**Default value:** false<br>**Description:** Show or hide the video description. |
| loadingControl | **Type:** jQuery selector<br>**Default value:** null<br>**Description:** A jQuery selection to the element that will appear at the beginning of video items loading. |
| loadingControlAnimationSpeed | **Type:** Integer<br>**Default value:** 100<br>**Description:** Define the fadeIn/fadeOut time effect of the loading control. |
| prevPageControl | **Type:** jQuery selector<br>**Default value:** null<br>**Description:** A jQuery selection to the element who will control the previous page. |
| nextPageControl | **Type:** jQuery selector<br>**Default value:** null<br>**Description:** A jQuery selection to the element who will control the next page. |
| pageControlDisabledClass | **Type:** String<br>**Default value:** disabled<br>**Description:** The class name for a disabled page control. When you are at the first page, the previous page control will be disabled. |
| videoItemContainerClass | **Type:** String<br>**Default value:** video-item<br>**Description:** All video items is wrapped by a div element. This option set the class name for it. |
| videoItemActiveClass | **Type:** String<br>**Default value:** active<br>**Description:** The class name for an active video item. It means when you click on one. |
| templates | **Type:** Object<br>**Description:** Define basic templates used to create DOM elements of video items. Each template can have variables following this way: {{variable_name}} |
| templates.player | **Type:** String<br>**Default value:** `<iframe frameborder="0" allowfullscreen></iframe>`<br>**Description:** abc |
| templates.thumbnail | **Type:** String<br>**Default value:** `<img src="{{image_default}}">`<br>**Description:** If the option "embedVideo" be false, this template is used to show the video thumbnail. It's possible to use `{{image_medium}}`, `{{image_high}}`, `{{image_standard}}` or `{{image_maxres}}` instead of `{{image_default}}` variable which changes the image size/quality. Of course, you can set all of them in the "srcset" attribute of the image. |
| templates.videoMedia | **Type:** String<br>**Default value:** `<span class="media">{{media}}</span>`<br>**Description:** This template represents the main part of a video item: its embed iframe or thumbnail. |
| templates.videoTitle | **Type:** String<br>**Default value:** `<span class="title">{{title}}</span>`<br>**Description:** Template for video item title. |
| templates.videoDescription | **Type:** String<br>**Default value:** `<span class="description">{{description}}</span>`<br>**Description:** Template for video item description. |
| templates.videoItem | **Type:** String<br>**Default value:** `{{video_media}}{{video_title}}{{video_description}}`<br>**Description:** Represent the basic structure of a video item, grouping all its parts and you can edit this template to reorder them. |
| templates.noVideos | **Type:** String<br>**Default value:** `<p class="no-videos">Sorry, there are no videos to show.</p>`<br>**Description:** Template used when there are no videos to show from the configured source (playlist, user or channel). |

## Events

| Event | Description  |
| ----- | ------------ |
| afterLoadVideoItems | **Description:** Always when a request for video items is finished, this callback is called. |