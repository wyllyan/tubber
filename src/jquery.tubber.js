/*
 * Tubber - A jQuery plugin for YouTube
 * https://github.com/wyllyan/tubber/
 * Version: 0.1.0
 * Copyright (c) 2015 - Under the MIT License
 */

;(function ($, window, undefined) {
	'use strict';

	// Plugin core
	function Tubber(container, options) {		
		var plugin = this;
		var callbacks = {
			afterLoadVideoItems: $.Callbacks()
		};

		// Find an element in a template returning it as a jQuery object
		function getElementFromTemplate(element, template) {
			return $(template).find(element).addBack(element);
		}

		// Replace template variables with the real values passed
		function translateTemplateVariables(template, variables) {
			$.each(variables, function(variable, translation) {
				template = template.replace(variable, translation !== undefined ? translation : '');
			});

			return template;
		}

		// Return an embed video from its id
		function getEmbedVideo(videoId) {
			var src = plugin.settings.embedVideoBaseUrl + videoId;
				
			return getElementFromTemplate('iframe', plugin.settings.templates.player).prop('src', src);
		}

		// Show/hide the loading control
		function showLoading(show) {
			var loadingControl = plugin.settings.loadingControl;

			if (isPluginControl(loadingControl)) {
				var loadingControlAnimationSpeed = plugin.settings.loadingControlAnimationSpeed;

				if (show) {
					loadingControl.fadeIn(loadingControlAnimationSpeed);
				} else {
					loadingControl.fadeOut(loadingControlAnimationSpeed);
				}
			}
		}

		// Configure and show the pagination
		function configurePagination() {
			if (!isPluginControl(plugin.settings.prevPageControl) && 
				!isPluginControl(plugin.settings.nextPageControl)) {
				return;
			}

			var pageControlDisabledClass = plugin.settings.pageControlDisabledClass;
			var configure = function (pageControl, pageTokenType) {
				pageControl.click(function () {
					var pageToken = getObjectProperty(plugin.youtubeData, pageTokenType);

					if (pageToken) {
						loadVideoItems(pageToken);
					}
				});

				callbacks.afterLoadVideoItems.add(function () {
					if (getObjectProperty(plugin.youtubeData, pageTokenType)) {
						pageControl.removeClass(pageControlDisabledClass);
					} else {
						pageControl.addClass(pageControlDisabledClass);
					}
				});
			};

			configure(plugin.settings.prevPageControl, 'prevPageToken');
			configure(plugin.settings.nextPageControl, 'nextPageToken');
		}

		// Configure how a video is shown: in an embed iframe, through a callback function or in its YouTube page
		function configureMediaViewer() {
			if (plugin.settings.embedVideo) {
				return;
			}

			var mediaViewer = plugin.settings.mediaViewer;
			var videoItemActiveClass = plugin.settings.videoItemActiveClass;

			container.on('click', '.' + plugin.settings.videoItemContainerClass, function () {
				var videoId = getObjectProperty($(this).data('tubber-video-data'), 'videoId');

				$(this).addClass(videoItemActiveClass).siblings().removeClass(videoItemActiveClass);

				if (isPluginControl(mediaViewer)) {
					mediaViewer.html(getEmbedVideo(videoId));
				} else if ($.isFunction(mediaViewer)) {
					mediaViewer.call(plugin, videoId);
				} else {
					window.open(plugin.settings.watchVideoBaseUrl + videoId, '_blank');
				}
			});

			callbacks.afterLoadVideoItems.add(function () {
				if (isPluginControl(mediaViewer)) {
					container.find('.' + plugin.settings.videoItemContainerClass).first().trigger('click');
				}
			});
		}

		// Return a jQuery object with the DOM element that represents the video item
		function createVideoItemElement(video) {
			var media = function () {
				if (plugin.settings.embedVideo) {
					return getEmbedVideo(video.videoId);
				} else {
					var thumbnailTemplate = plugin.settings.templates.thumbnail;
					thumbnailTemplate = translateTemplateVariables(thumbnailTemplate, {
						'{{image_default}}': getObjectProperty(video.thumbnails, 'default.url'),
						'{{image_medium}}': getObjectProperty(video.thumbnails, 'medium.url'),
						'{{image_high}}': getObjectProperty(video.thumbnails, 'high.url'),
						'{{image_standard}}': getObjectProperty(video.thumbnails, 'standard.url'),
						'{{image_maxres}}': getObjectProperty(video.thumbnails, 'maxres.url')
					});

					return getElementFromTemplate('img', thumbnailTemplate).prop('alt', video.title);
				}		
			};

			var title = function () {
				if (plugin.settings.showVideoTitle) {					
					return translateTemplateVariables(plugin.settings.templates.videoTitle, {
						'{{title}}': video.title
					});
				}
			};

			var description = function () {
				if (plugin.settings.showVideoDescription) {					
					return translateTemplateVariables(plugin.settings.templates.videoDescription, {
						'{{description}}': video.description
					});
				}
			};

			return $('<div/>', {
				class: plugin.settings.videoItemContainerClass,
				data: {'tubber-video-data': video},
				html: translateTemplateVariables(plugin.settings.templates.videoItem, {
					'{{video_media}}': media().prop('outerHTML'),
					'{{video_title}}': title(),
					'{{video_description}}': description()
				})
			});
		}

		// Return basic video data from Playlist Item
		function getVideoDataFromPlaylistItem(playlistItem) {
			return {
				title: playlistItem.snippet.title,
				description: playlistItem.snippet.description,
				publishedAt: playlistItem.snippet.publishedAt,
				videoId: playlistItem.snippet.resourceId.videoId,
				thumbnails: playlistItem.snippet.thumbnails
			};
		}

		// Show video items in the container
		function showVideoItems() {
			if (!plugin.youtubeData) {
				return;
			}

			var playlistItems = plugin.youtubeData.items;
			var videoItemsElements = [];

			if (playlistItems.length) {
				$.each(playlistItems, function(_, playlistItem) {
					var video = getVideoDataFromPlaylistItem(playlistItem);
					videoItemsElements.push(createVideoItemElement(video));
				});

				container.html(videoItemsElements);
			} else {
				container.html(plugin.settings.templates.noVideos);
			}
		}

		// Load video items from YouTube
		function loadVideoItems(pageToken) {
			var playlistRequest;
			var itemsPerPage = plugin.settings.itemsPerPage;

			if (plugin.settings.playlistId) {
				playlistRequest = plugin.youtubeApi.getPlaylistItems(plugin.settings.playlistId, itemsPerPage, pageToken);
			} else if (plugin.settings.username) {
				playlistRequest = plugin.youtubeApi.getUploadsByUsername(plugin.settings.username, itemsPerPage, pageToken);
			} else if (plugin.settings.channelId) {
				playlistRequest = plugin.youtubeApi.getUploadsByChannelId(plugin.settings.channelId, itemsPerPage, pageToken);
			}

			showLoading(true);

			playlistRequest
				.done(function (data) {
					plugin.youtubeData = data;
					showVideoItems();
					callbacks.afterLoadVideoItems.fire(data);
				}).always(function () {
					showLoading(false);
				});
		}

		// Return a property value from an object with safely
		function getObjectProperty(obj, propertySelector) {
			if (!obj) {
				return;
			}

			var properties = propertySelector.split('.');
    		var property = null;

    		while ((property = properties.shift())) {
		        if (obj.hasOwnProperty(property)) {
		            obj = obj[property];
		            
		            if (!properties.length) {
		                return obj;
		            }
		        } else {
		            return;
		        }
		    }
		}

		// Check if a plugin control is a jQuery object and it can be found
		function isPluginControl(control) {
			return control instanceof $ && control.length;
		}

		// Attach callbacks from the settings to the ones available in plugin
		function addCallbacks() {
			$.each(callbacks, function(callbackName, callback) {
				callback.add(plugin.settings[callbackName]);
			});
		}

		// Plugin initialization
		plugin.init = function () {
			plugin.settings = $.extend(true, {}, $.fn.tubber.defaults, options);
			plugin.youtubeApi = new $.fn.tubber.youtubeApi(plugin.settings.apiKey);
			
			addCallbacks();
			loadVideoItems();
			configurePagination();
			configureMediaViewer();

			return plugin;
		};
	}

	// Plugin definition
	$.fn.tubber = function (options) {
		return this.each(function () {
			if (!$(this).data('tubber')) {
				$(this).data('tubber', new Tubber($(this), options).init());
			}
		});
	};

	// Access to YouTube Data API (v3)
	$.fn.tubber.youtubeApi = function (apiKey) {
		var baseUrl = 'https://www.googleapis.com/youtube/v3/';
		var getData = function (resource, params) {
			params.key = apiKey;

			return $.getJSON(baseUrl + resource, params);		
		};

		this.getChannelByUsername = function (username) {
			return getData('channels', {
				part: 'contentDetails',
				forUsername: username
			});
		};

		this.getChannelById = function (channelId) {
			return getData('channels', {
				part: 'contentDetails',
				id: channelId
			});
		};

		this.getPlaylistItems = function (playlistId, itemsPerPage, pageToken) {
			return getData('playlistItems', {
				part: 'snippet',
				playlistId: playlistId,
				maxResults: itemsPerPage,
				pageToken: pageToken
			});	
		};

		function getUploads(jqXHR, itemsPerPage, pageToken) {
			/* jshint validthis: true */
			return jqXHR.then($.proxy(function (data) {
				var uploadsPlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads;

				return this.getPlaylistItems(uploadsPlaylistId, itemsPerPage, pageToken);
			}, this));
		}

		this.getUploadsByUsername = function (username, itemsPerPage, pageToken) {
			return getUploads.call(this, this.getChannelByUsername(username), itemsPerPage, pageToken);
		};

		this.getUploadsByChannelId = function (channelId, itemsPerPage, pageToken) {
			return getUploads.call(this, this.getChannelById(channelId), itemsPerPage, pageToken);
		};
	};

	$.fn.tubber.defaults = {
		// Basic plugin options
		apiKey: null,
		playlistId: null,
		username: null,
		channelId: null,
		itemsPerPage: 5,
		embedVideo: true,
		embedVideoBaseUrl: 'https://www.youtube.com/embed/',
		mediaViewer: null,
		watchVideoBaseUrl: 'https://www.youtube.com/watch?v=',
		showVideoTitle: false,
		showVideoDescription: false,
		loadingControl: null,
		loadingControlAnimationSpeed: 100,
		prevPageControl: null,
		nextPageControl: null,
		pageControlDisabledClass: 'disabled',
		videoItemContainerClass: 'video-item',
		videoItemActiveClass: 'active',

		// HTML templates
		templates: {
			player: '<iframe frameborder="0" allowfullscreen></iframe>',
			thumbnail: '<img src="{{image_default}}">',
			videoMedia: '<span class="media">{{media}}</span>',
			videoTitle: '<span class="title">{{title}}</span>',
			videoDescription: '<span class="description">{{description}}</span>',
			videoItem: '{{video_media}}{{video_title}}{{video_description}}',
			noVideos: '<p class="no-videos">Sorry, there are no videos to show.</p>'
		}
	};

}(jQuery, window));