function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function update_tags(element, tags) {
    $(element).on('click', function() {
        // console.log(element)
        // console.log("hellooooo");
        console.log(tags)

    })
}



window.showBSModal = function self(options) {

    var options = $.extend({
        title: '',
        body: '',
        remote: false,
        backdrop: 'static',
        size: false,
        onShow: false,
        onHide: false,
        actions: false
    }, options);

    self.onShow = typeof options.onShow == 'function' ? options.onShow : function() {};
    self.onHide = typeof options.onHide == 'function' ? options.onHide : function() {};

    if (self.$modal == undefined) {
        self.$modal = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
        self.$modal.on('shown.bs.modal', function(e) {
            self.onShow.call(this, e);
        });
        self.$modal.on('hidden.bs.modal', function(e) {
            self.onHide.call(this, e);
        });
    }

    var modalClass = {
        small: "modal-sm",
        large: "modal-lg"
    };

    self.$modal.data('bs.modal', false);
    self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ' + (modalClass[options.size] || ''));
    self.$modal.find('.modal-content').html('<div class="modal-header"><h4 class="modal-title">${title}</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

    var footer = self.$modal.find('.modal-footer');
    if (Object.prototype.toString.call(options.actions) == "[object Array]") {
        for (var i = 0, l = options.actions.length; i < l; i++) {
            options.actions[i].onClick = typeof options.actions[i].onClick == 'function' ? options.actions[i].onClick : function() {};
            $('<button type="button" class="btn ' + (options.actions[i].cssClass || '') + '">' + (options.actions[i].label || '{Label Missing!}') + '</button>').appendTo(footer).on('click', options.actions[i].onClick);
        }
    } else {
        $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>').appendTo(footer);
    }

    self.$modal.modal(options);
}
function add_tag() {
    $('#formAddTagInput').keypress(function() {
        if (event.which == 13) {
            event.preventDefault();
            let tag = '<button type="button" class="btn btn-outline-dark tag">' + $('#formAddTagInput').val() + '</button>'
            $('#product-tags').append(tag);
            $('#product-tags').append(" ");
            $('#formAddTagInput').val("");
        }
    });
}

function delete_tag() {
    $('#product-tags').on('click', '.tag', function() {
        if ($('#product-tags').find(this).hasClass('existing-tag')) {
            $('#tag-cloud').append(this);
            $('#tag-cloud').append(" ");
        }
        $('#product-tags').find(this).remove();
    });
}

function add_existing_tag() {
    $('#tag-cloud').on('click', '.tag', function() {
        $('#product-tags').append(this);
        $('#product-tags').append(" ");
    });
}

function load_tag_cloud(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        let tag_html = '<button type="button" class="btn btn-outline-dark tag existing-tag">' + tag_info[0] + '</button>'
        $('#tag-cloud').append(tag_html);
        $('#tag-cloud').append(" ");
    });
}

function get_product_tags() {
    let tags = [];
    $('#product-tags button').each(function() {
        tags.push($(this).text());
    });
    return tags;
}

function clear_add_product_form() {
    $('#add-product-form').trigger("reset");
    const product_tags = $('#product-tags').html()
    $('#tag-cloud').append(product_tags);
    $('#product-tags').text("")
}

function alert_message(message, alert_type = "alert-danger") {
    $('#alerts').html('<div class="alert ' + alert_type + '" role="role">' +
        message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true"> &times;</span>' +
        '</button></div>');
}


function load_latest_added_product(png_path, item_id, tags) {
    var row = $('<div>').addClass('row').prependTo($("#added-products"));
    var img = $('<img>', { src: bucket_url + png_path, class: "img-thumbnail" });
    var tag_list = $('<span>').text(tags).attr('contenteditable', 'true')
    $('<div>').addClass('col-2').html(img).appendTo(row);
    var tag_div = $('<div>').addClass('col-10').html(tag_list).appendTo(row);
    $('<p>').appendTo(tag_div);
    var update_button = $('<button>').addClass("update-tags").text("Update tags").appendTo(tag_div);
    var delete_button = $('<button>').addClass("delete_item").text("Delete item").appendTo(tag_div);
    update_tags_ajax(update_button, item_id, tag_list)
    delete_product_ajax(delete_button, item_id);
    $(delete_button).on('click', function() {
        $(row).remove()
    })
}
/*
 * pagination.js 2.1.5
 * A jQuery plugin to provide simple yet fully customisable pagination.
 * https://github.com/superRaytin/paginationjs
 *
 * Homepage: http://pagination.js.org
 *
 * Copyright 2014-2100, superRaytin
 * Released under the MIT license.
 */

(function(global, $) {

  if (typeof $ === 'undefined') {
    throwError('Pagination requires jQuery.');
  }

  var pluginName = 'pagination';

  var pluginHookMethod = 'addHook';

  var eventPrefix = '__pagination-';

  // Conflict, use backup
  if ($.fn.pagination) {
    pluginName = 'pagination2';
  }

  $.fn[pluginName] = function(options) {

    if (typeof options === 'undefined') {
      return this;
    }

    var container = $(this);

    var attributes = $.extend({}, $.fn[pluginName].defaults, options);

    var pagination = {

      initialize: function() {
        var self = this;

        // Cache attributes of current instance
        if (!container.data('pagination')) {
          container.data('pagination', {});
        }

        if (self.callHook('beforeInit') === false) return;

        // Pagination has been initialized, destroy it
        if (container.data('pagination').initialized) {
          $('.paginationjs', container).remove();
        }

        // Whether to disable Pagination at the initialization
        self.disabled = !!attributes.disabled;

        // Model will be passed to the callback function
        var model = self.model = {
          pageRange: attributes.pageRange,
          pageSize: attributes.pageSize
        };

        // dataSource`s type is unknown, parse it to find true data
        self.parseDataSource(attributes.dataSource, function(dataSource) {

          // Currently in asynchronous mode
          self.isAsync = Helpers.isString(dataSource);
          if (Helpers.isArray(dataSource)) {
            model.totalNumber = attributes.totalNumber = dataSource.length;
          }

          // Currently in asynchronous mode and a totalNumberLocator is specified
          self.isDynamicTotalNumber = self.isAsync && attributes.totalNumberLocator;

          var el = self.render(true);

          // Add extra className to the pagination element
            if (attributes.className) {
            el.addClass(attributes.className);
          }

          model.el = el;

          // Append/prepend pagination element to the container
          container[attributes.position === 'bottom' ? 'append' : 'prepend'](el);

          // Bind events
          self.observer();

          // Pagination is currently initialized
          container.data('pagination').initialized = true;

          // Will be invoked after initialized
          self.callHook('afterInit', el);
        });
      },

      render: function(isBoot) {
        var self = this;
        var model = self.model;
        var el = model.el || $('<div class="paginationjs"></div>');
        var isForced = isBoot !== true;

        self.callHook('beforeRender', isForced);

        var currentPage = model.pageNumber || attributes.pageNumber;
        var pageRange = attributes.pageRange || 0;
        var totalPage = self.getTotalPage();

        var rangeStart = currentPage - pageRange;
        var rangeEnd = currentPage + pageRange;

        if (rangeEnd > totalPage) {
          rangeEnd = totalPage;
          rangeStart = totalPage - pageRange * 2;
          rangeStart = rangeStart < 1 ? 1 : rangeStart;
        }

        if (rangeStart <= 1) {
          rangeStart = 1;
          rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
        }

        el.html(self.generateHTML({
          currentPage: currentPage,
          pageRange: pageRange,
          rangeStart: rangeStart,
          rangeEnd: rangeEnd
        }));

        // There is only one page
        if (attributes.hideWhenLessThanOnePage) {
          el[totalPage <= 1 ? 'hide' : 'show']();
        }

        self.callHook('afterRender', isForced);

        return el;
      },

      // Generate HTML of the pages
      generatePageNumbersHTML: function(args) {
        var self = this;
        var currentPage = args.currentPage;
        var totalPage = self.getTotalPage();
        var rangeStart = args.rangeStart;
        var rangeEnd = args.rangeEnd;
        var html = '';
        var i;

        var pageLink = attributes.pageLink;
        var ellipsisText = attributes.ellipsisText;

        var classPrefix = attributes.classPrefix;
        var activeClassName = attributes.activeClassName;
        var disableClassName = attributes.disableClassName;

        // Disable page range, display all the pages
        if (attributes.pageRange === null) {
          for (i = 1; i <= totalPage; i++) {
            if (i == currentPage) {
              html += '<li class="' + classPrefix + '-page J-paginationjs-page ' + activeClassName + '" data-num="' + i + '"><a>' + i + '<\/a><\/li>';
            } else {
              html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageLink + '">' + i + '<\/a><\/li>';
            }
          }
          return html;
        }

        if (rangeStart <= 3) {
          for (i = 1; i < rangeStart; i++) {
            if (i == currentPage) {
              html += '<li class="' + classPrefix + '-page J-paginationjs-page ' + activeClassName + '" data-num="' + i + '"><a>' + i + '<\/a><\/li>';
            } else {
              html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageLink + '">' + i + '<\/a><\/li>';
            }
          }
        } else {
          if (attributes.showFirstOnEllipsisShow) {
            html += '<li class="' + classPrefix + '-page ' + classPrefix + '-first J-paginationjs-page" data-num="1"><a href="' + pageLink + '">1<\/a><\/li>';
          }
          html += '<li class="' + classPrefix + '-ellipsis ' + disableClassName + '"><a>' + ellipsisText + '<\/a><\/li>';
        }

        for (i = rangeStart; i <= rangeEnd; i++) {
          if (i == currentPage) {
            html += '<li class="' + classPrefix + '-page J-paginationjs-page ' + activeClassName + '" data-num="' + i + '"><a>' + i + '<\/a><\/li>';
          } else {
            html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageLink + '">' + i + '<\/a><\/li>';
          }
        }

        if (rangeEnd >= totalPage - 2) {
          for (i = rangeEnd + 1; i <= totalPage; i++) {
            html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageLink + '">' + i + '<\/a><\/li>';
          }
        } else {
          html += '<li class="' + classPrefix + '-ellipsis ' + disableClassName + '"><a>' + ellipsisText + '<\/a><\/li>';

          if (attributes.showLastOnEllipsisShow) {
            html += '<li class="' + classPrefix + '-page ' + classPrefix + '-last J-paginationjs-page" data-num="' + totalPage + '"><a href="' + pageLink + '">' + totalPage + '<\/a><\/li>';
          }
        }

        return html;
      },

      // Generate HTML content from the template
      generateHTML: function(args) {
        var self = this;
        var currentPage = args.currentPage;
        var totalPage = self.getTotalPage();

        var totalNumber = self.getTotalNumber();

        var showPrevious = attributes.showPrevious;
        var showNext = attributes.showNext;
        var showPageNumbers = attributes.showPageNumbers;
        var showNavigator = attributes.showNavigator;
        var showGoInput = attributes.showGoInput;
        var showGoButton = attributes.showGoButton;

        var pageLink = attributes.pageLink;
        var prevText = attributes.prevText;
        var nextText = attributes.nextText;
        var goButtonText = attributes.goButtonText;

        var classPrefix = attributes.classPrefix;
        var disableClassName = attributes.disableClassName;
        var ulClassName = attributes.ulClassName;

        var html = '';
        var goInput = '<input type="text" class="J-paginationjs-go-pagenumber">';
        var goButton = '<input type="button" class="J-paginationjs-go-button" value="' + goButtonText + '">';
        var formattedString;

        var formatNavigator = $.isFunction(attributes.formatNavigator) ? attributes.formatNavigator(currentPage, totalPage, totalNumber) : attributes.formatNavigator;
        var formatGoInput = $.isFunction(attributes.formatGoInput) ? attributes.formatGoInput(goInput, currentPage, totalPage, totalNumber) : attributes.formatGoInput;
        var formatGoButton = $.isFunction(attributes.formatGoButton) ? attributes.formatGoButton(goButton, currentPage, totalPage, totalNumber) : attributes.formatGoButton;

        var autoHidePrevious = $.isFunction(attributes.autoHidePrevious) ? attributes.autoHidePrevious() : attributes.autoHidePrevious;
        var autoHideNext = $.isFunction(attributes.autoHideNext) ? attributes.autoHideNext() : attributes.autoHideNext;

        var header = $.isFunction(attributes.header) ? attributes.header(currentPage, totalPage, totalNumber) : attributes.header;
        var footer = $.isFunction(attributes.footer) ? attributes.footer(currentPage, totalPage, totalNumber) : attributes.footer;

        // Whether to display header
        if (header) {
          formattedString = self.replaceVariables(header, {
            currentPage: currentPage,
            totalPage: totalPage,
            totalNumber: totalNumber
          });
          html += formattedString;
        }

        if (showPrevious || showPageNumbers || showNext) {
          html += '<div class="paginationjs-pages">';

          if (ulClassName) {
            html += '<ul class="' + ulClassName + '">';
          } else {
            html += '<ul>';
          }

          // Whether to display the Previous button
          if (showPrevious) {
            if (currentPage <= 1) {
              if (!autoHidePrevious) {
                html += '<li class="' + classPrefix + '-prev ' + disableClassName + '"><a>' + prevText + '<\/a><\/li>';
              }
            } else {
              html += '<li class="' + classPrefix + '-prev J-paginationjs-previous" data-num="' + (currentPage - 1) + '" title="Previous page"><a href="' + pageLink + '">' + prevText + '<\/a><\/li>';
            }
          }

          // Whether to display the pages
          if (showPageNumbers) {
            html += self.generatePageNumbersHTML(args);
          }

          // Whether to display the Next button
          if (showNext) {
            if (currentPage >= totalPage) {
              if (!autoHideNext) {
                html += '<li class="' + classPrefix + '-next ' + disableClassName + '"><a>' + nextText + '<\/a><\/li>';
              }
            } else {
              html += '<li class="' + classPrefix + '-next J-paginationjs-next" data-num="' + (currentPage + 1) + '" title="Next page"><a href="' + pageLink + '">' + nextText + '<\/a><\/li>';
            }
          }
          html += '<\/ul><\/div>';
        }

        // Whether to display the navigator
        if (showNavigator) {
          if (formatNavigator) {
            formattedString = self.replaceVariables(formatNavigator, {
              currentPage: currentPage,
              totalPage: totalPage,
              totalNumber: totalNumber
            });
            html += '<div class="' + classPrefix + '-nav J-paginationjs-nav">' + formattedString + '<\/div>';
          }
        }

        // Whether to display the Go input
        if (showGoInput) {
          if (formatGoInput) {
            formattedString = self.replaceVariables(formatGoInput, {
              currentPage: currentPage,
              totalPage: totalPage,
              totalNumber: totalNumber,
              input: goInput
            });
            html += '<div class="' + classPrefix + '-go-input">' + formattedString + '</div>';
          }
        }

        // Whether to display the Go button
        if (showGoButton) {
          if (formatGoButton) {
            formattedString = self.replaceVariables(formatGoButton, {
              currentPage: currentPage,
              totalPage: totalPage,
              totalNumber: totalNumber,
              button: goButton
            });
            html += '<div class="' + classPrefix + '-go-button">' + formattedString + '</div>';
          }
        }

        // Whether to display footer
        if (footer) {
          formattedString = self.replaceVariables(footer, {
            currentPage: currentPage,
            totalPage: totalPage,
            totalNumber: totalNumber
          });
          html += formattedString;
        }

        return html;
      },

      // Find totalNumber from the remote response
      // Only available in asynchronous mode
      findTotalNumberFromRemoteResponse: function(response) {
        var self = this;
        self.model.totalNumber = attributes.totalNumberLocator(response);
      },

      // Go to the specified page
      go: function(number, callback) {
        var self = this;
        var model = self.model;

        if (self.disabled) return;

        var pageNumber = number;
        pageNumber = parseInt(pageNumber);

        // Page number is out of bounds
        if (!pageNumber || pageNumber < 1) return;

        var pageSize = attributes.pageSize;
        var totalNumber = self.getTotalNumber();
        var totalPage = self.getTotalPage();

        // Page number is out of bounds
        if (totalNumber > 0) {
          if (pageNumber > totalPage) return;
        }

        // Pick data fragment in synchronous mode
        if (!self.isAsync) {
          render(self.getDataFragment(pageNumber));
          return;
        }

        var postData = {};
        var alias = attributes.alias || {};
        postData[alias.pageSize ? alias.pageSize : 'pageSize'] = pageSize;
        postData[alias.pageNumber ? alias.pageNumber : 'pageNumber'] = pageNumber;

        var ajaxParams = $.isFunction(attributes.ajax) ? attributes.ajax() : attributes.ajax;
        var formatAjaxParams = {
          type: 'get',
          cache: false,
          data: {},
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          dataType: 'json',
          async: true
        };

        $.extend(true, formatAjaxParams, ajaxParams);
        $.extend(formatAjaxParams.data, postData);

        formatAjaxParams.url = attributes.dataSource;
        formatAjaxParams.success = function(response) {
          if (self.isDynamicTotalNumber) {
            self.findTotalNumberFromRemoteResponse(response);
          } else {
            self.model.totalNumber = attributes.totalNumber;
          }

          var finalData = self.filterDataByLocator(response);
          render(finalData);
        };
        formatAjaxParams.error = function(jqXHR, textStatus, errorThrown) {
          attributes.formatAjaxError && attributes.formatAjaxError(jqXHR, textStatus, errorThrown);
          self.enable();
        };

        self.disable();

        $.ajax(formatAjaxParams);

        function render(data) {
          // Will be invoked before paging
          if (self.callHook('beforePaging', pageNumber) === false) return false;

          // Pagination direction
          model.direction = typeof model.pageNumber === 'undefined' ? 0 : (pageNumber > model.pageNumber ? 1 : -1);

          model.pageNumber = pageNumber;

          self.render();

          if (self.disabled && self.isAsync) {
            // enable pagination
            self.enable();
          }

          // cache model data
          container.data('pagination').model = model;

          // format result data before callback invoked
          if (attributes.formatResult) {
            var cloneData = $.extend(true, [], data);
            if (!Helpers.isArray(data = attributes.formatResult(cloneData))) {
              data = cloneData;
            }
          }

          container.data('pagination').currentPageData = data;

          // invoke callback
          self.doCallback(data, callback);

          self.callHook('afterPaging', pageNumber);

          // pageNumber now is the first page
          if (pageNumber == 1) {
            self.callHook('afterIsFirstPage');
          }

          // pageNumber now is the last page
          if (pageNumber == self.getTotalPage()) {
            self.callHook('afterIsLastPage');
          }
        }
      },

      doCallback: function(data, customCallback) {
        var self = this;
        var model = self.model;

        if ($.isFunction(customCallback)) {
          customCallback(data, model);
        } else if ($.isFunction(attributes.callback)) {
          attributes.callback(data, model);
        }
      },

      destroy: function() {
        // Before destroy
        if (this.callHook('beforeDestroy') === false) return;

        this.model.el.remove();
        container.off();

        // Remove style element
        $('#paginationjs-style').remove();

        // After destroyed
        this.callHook('afterDestroy');
      },

      previous: function(callback) {
        this.go(this.model.pageNumber - 1, callback);
      },

      next: function(callback) {
        this.go(this.model.pageNumber + 1, callback);
      },

      disable: function() {
        var self = this;
        var source = self.isAsync ? 'async' : 'sync';

        // Before disabled
        if (self.callHook('beforeDisable', source) === false) return;

        self.disabled = true;
        self.model.disabled = true;

        // After disabled
        self.callHook('afterDisable', source);
      },

      enable: function() {
        var self = this;
        var source = self.isAsync ? 'async' : 'sync';

        // Before enabled
        if (self.callHook('beforeEnable', source) === false) return;

        self.disabled = false;
        self.model.disabled = false;

        // After enabled
        self.callHook('afterEnable', source);
      },

      refresh: function(callback) {
        this.go(this.model.pageNumber, callback);
      },

      show: function() {
        var self = this;

        if (self.model.el.is(':visible')) return;

        self.model.el.show();
      },

      hide: function() {
        var self = this;

        if (!self.model.el.is(':visible')) return;

        self.model.el.hide();
      },

      // Parse variables in the template
      replaceVariables: function(template, variables) {
        var formattedString;

        for (var key in variables) {
          var value = variables[key];
          var regexp = new RegExp('<%=\\s*' + key + '\\s*%>', 'img');

          formattedString = (formattedString || template).replace(regexp, value);
        }

        return formattedString;
      },

      // Get data fragment
      getDataFragment: function(number) {
        var pageSize = attributes.pageSize;
        var dataSource = attributes.dataSource;
        var totalNumber = this.getTotalNumber();

        var start = pageSize * (number - 1) + 1;
        var end = Math.min(number * pageSize, totalNumber);

        return dataSource.slice(start - 1, end);
      },

      // Get total number
      getTotalNumber: function() {
        return this.model.totalNumber || attributes.totalNumber || 0;
      },

      // Get total page
      getTotalPage: function() {
        return Math.ceil(this.getTotalNumber() / attributes.pageSize);
      },

      // Get locator
      getLocator: function(locator) {
        var result;

        if (typeof locator === 'string') {
          result = locator;
        } else if ($.isFunction(locator)) {
          result = locator();
        } else {
          throwError('"locator" is incorrect. (String | Function)');
        }

        return result;
      },

      // Filter data by "locator"
      filterDataByLocator: function(dataSource) {
        var locator = this.getLocator(attributes.locator);
        var filteredData;

        // Datasource is an Object, use "locator" to locate the true data
        if (Helpers.isObject(dataSource)) {
          try {
            $.each(locator.split('.'), function(index, item) {
              filteredData = (filteredData ? filteredData : dataSource)[item];
            });
          }
          catch (e) {
          }

          if (!filteredData) {
            throwError('dataSource.' + locator + ' is undefined.');
          } else if (!Helpers.isArray(filteredData)) {
            throwError('dataSource.' + locator + ' must be an Array.');
          }
        }

        return filteredData || dataSource;
      },

      // Parse dataSource
      parseDataSource: function(dataSource, callback) {
        var self = this;

        if (Helpers.isObject(dataSource)) {
          callback(attributes.dataSource = self.filterDataByLocator(dataSource));
        } else if (Helpers.isArray(dataSource)) {
          callback(attributes.dataSource = dataSource);
        } else if ($.isFunction(dataSource)) {
          attributes.dataSource(function(data) {
            if (!Helpers.isArray(data)) {
              throwError('The parameter of "done" Function should be an Array.');
            }
            self.parseDataSource.call(self, data, callback);
          });
        } else if (typeof dataSource === 'string') {
          if (/^https?|file:/.test(dataSource)) {
            attributes.ajaxDataType = 'jsonp';
          }
          callback(dataSource);
        } else {
          throwError('Unexpected type of "dataSource".');
        }
      },

      callHook: function(hook) {
        var paginationData = container.data('pagination');
        var result;

        var args = Array.prototype.slice.apply(arguments);
        args.shift();

        if (attributes[hook] && $.isFunction(attributes[hook])) {
          if (attributes[hook].apply(global, args) === false) {
            result = false;
          }
        }

        if (paginationData.hooks && paginationData.hooks[hook]) {
          $.each(paginationData.hooks[hook], function(index, item) {
            if (item.apply(global, args) === false) {
              result = false;
            }
          });
        }

        return result !== false;
      },

      observer: function() {
        var self = this;
        var el = self.model.el;

        // Go to specified page number
        container.on(eventPrefix + 'go', function(event, pageNumber, done) {
          pageNumber = parseInt($.trim(pageNumber));

          if (!pageNumber) return;

          if (!$.isNumeric(pageNumber)) {
            throwError('"pageNumber" is incorrect. (Number)');
          }

          self.go(pageNumber, done);
        });

        // Page number button click
        el.delegate('.J-paginationjs-page', 'click', function(event) {
          var current = $(event.currentTarget);
          var pageNumber = $.trim(current.attr('data-num'));

          if (!pageNumber || current.hasClass(attributes.disableClassName) || current.hasClass(attributes.activeClassName)) return;

          // Before page button clicked
          if (self.callHook('beforePageOnClick', event, pageNumber) === false) return false;

          self.go(pageNumber);

          // After page button clicked
          self.callHook('afterPageOnClick', event, pageNumber);

          if (!attributes.pageLink) return false;
        });

        // Previous button click
        el.delegate('.J-paginationjs-previous', 'click', function(event) {
          var current = $(event.currentTarget);
          var pageNumber = $.trim(current.attr('data-num'));

          if (!pageNumber || current.hasClass(attributes.disableClassName)) return;

          // Before previous clicked
          if (self.callHook('beforePreviousOnClick', event, pageNumber) === false) return false;

          self.go(pageNumber);

          // After previous clicked
          self.callHook('afterPreviousOnClick', event, pageNumber);

          if (!attributes.pageLink) return false;
        });

        // Next button click
        el.delegate('.J-paginationjs-next', 'click', function(event) {
          var current = $(event.currentTarget);
          var pageNumber = $.trim(current.attr('data-num'));

          if (!pageNumber || current.hasClass(attributes.disableClassName)) return;

          // Before next clicked
          if (self.callHook('beforeNextOnClick', event, pageNumber) === false) return false;

          self.go(pageNumber);

          // After next clicked
          self.callHook('afterNextOnClick', event, pageNumber);

          if (!attributes.pageLink) return false;
        });

        // Go button click
        el.delegate('.J-paginationjs-go-button', 'click', function(event) {
          var pageNumber = $('.J-paginationjs-go-pagenumber', el).val();

          // Before Go button clicked
          if (self.callHook('beforeGoButtonOnClick', event, pageNumber) === false) return false;

          container.trigger(eventPrefix + 'go', pageNumber);

          // After Go button clicked
          self.callHook('afterGoButtonOnClick', event, pageNumber);
        });

        // go input enter
        el.delegate('.J-paginationjs-go-pagenumber', 'keyup', function(event) {
          if (event.which === 13) {
            var pageNumber = $(event.currentTarget).val();

            // Before Go input enter
            if (self.callHook('beforeGoInputOnEnter', event, pageNumber) === false) return false;

            container.trigger(eventPrefix + 'go', pageNumber);

            // Regains focus
            $('.J-paginationjs-go-pagenumber', el).focus();

            // After Go input enter
            self.callHook('afterGoInputOnEnter', event, pageNumber);
          }
        });

        // Previous page
        container.on(eventPrefix + 'previous', function(event, done) {
          self.previous(done);
        });

        // Next page
        container.on(eventPrefix + 'next', function(event, done) {
          self.next(done);
        });

        // Disable
        container.on(eventPrefix + 'disable', function() {
          self.disable();
        });

        // Enable
        container.on(eventPrefix + 'enable', function() {
          self.enable();
        });

        // Refresh
        container.on(eventPrefix + 'refresh', function(event, done) {
          self.refresh(done);
        });

        // Show
        container.on(eventPrefix + 'show', function() {
          self.show();
        });

        // Hide
        container.on(eventPrefix + 'hide', function() {
          self.hide();
        });

        // Destroy
        container.on(eventPrefix + 'destroy', function() {
          self.destroy();
        });

        // Whether to load the default page
        var validTotalPage = Math.max(self.getTotalPage(), 1)
        var defaultPageNumber = attributes.pageNumber;
        // Default pageNumber should be 1 when totalNumber is dynamic
        if (self.isDynamicTotalNumber) {
          defaultPageNumber = 1;
        }
        if (attributes.triggerPagingOnInit) {
          container.trigger(eventPrefix + 'go', Math.min(defaultPageNumber, validTotalPage));
        }
      }
    };

    // Pagination has been initialized
    if (container.data('pagination') && container.data('pagination').initialized === true) {
      // Handle events
      if ($.isNumeric(options)) {
        // eg: container.pagination(5)
        container.trigger.call(this, eventPrefix + 'go', options, arguments[1]);
        return this;
      } else if (typeof options === 'string') {
        var args = Array.prototype.slice.apply(arguments);
        args[0] = eventPrefix + args[0];

        switch (options) {
          case 'previous':
          case 'next':
          case 'go':
          case 'disable':
          case 'enable':
          case 'refresh':
          case 'show':
          case 'hide':
          case 'destroy':
            container.trigger.apply(this, args);
            break;
          // Get selected page number
          case 'getSelectedPageNum':
            if (container.data('pagination').model) {
              return container.data('pagination').model.pageNumber;
            } else {
              return container.data('pagination').attributes.pageNumber;
            }
          // Get total page
          case 'getTotalPage':
            return Math.ceil(container.data('pagination').model.totalNumber / container.data('pagination').model.pageSize);
          // Get data of selected page
          case 'getSelectedPageData':
            return container.data('pagination').currentPageData;
          // Whether pagination has been disabled
          case 'isDisabled':
            return container.data('pagination').model.disabled === true;
          default:
            throwError('Unknown action: ' + options);
        }
        return this;
      } else {
        // Uninstall the old instance before initializing a new one
        uninstallPlugin(container);
      }
    } else {
      if (!Helpers.isObject(options)) throwError('Illegal options');
    }

    // Check parameters
    parameterChecker(attributes);

    pagination.initialize();

    return this;
  };

  // Instance defaults
  $.fn[pluginName].defaults = {

    // Data source
    // Array | String | Function | Object
    //dataSource: '',

    // String | Function
    //locator: 'data',

    // Find totalNumber from remote response, the totalNumber will be ignored when totalNumberLocator is specified
    // Function
    //totalNumberLocator: function() {},

    // Total entries
    totalNumber: 0,

    // Default page
    pageNumber: 1,

    // entries of per page
    pageSize: 10,

    // Page range (pages on both sides of the current page)
    pageRange: 2,

    // Whether to display the 'Previous' button
    showPrevious: true,

    // Whether to display the 'Next' button
    showNext: true,

    // Whether to display the page buttons
    showPageNumbers: true,

    showNavigator: false,

    // Whether to display the 'Go' input
    showGoInput: false,

    // Whether to display the 'Go' button
    showGoButton: false,

    // Page link
    pageLink: '',

    // 'Previous' text
    prevText: '&laquo;',

    // 'Next' text
    nextText: '&raquo;',

    // Ellipsis text
    ellipsisText: '...',

    // 'Go' button text
    goButtonText: 'Go',

    // Additional className for Pagination element
    //className: '',

    classPrefix: 'paginationjs',

    // Default active class
    activeClassName: 'active',

    // Default disable class
    disableClassName: 'disabled',

    //ulClassName: '',

    // Whether to insert inline style
    inlineStyle: true,

    formatNavigator: '<%= currentPage %> / <%= totalPage %>',

    formatGoInput: '<%= input %>',

    formatGoButton: '<%= button %>',

    // Pagination element's position in the container
    position: 'bottom',

    // Auto hide previous button when current page is the first page
    autoHidePrevious: false,

    // Auto hide next button when current page is the last page
    autoHideNext: false,

    //header: '',

    //footer: '',

    // Aliases for custom pagination parameters
    //alias: {},

    // Whether to trigger pagination at initialization
    triggerPagingOnInit: true,

    // Whether to hide pagination when less than one page
    hideWhenLessThanOnePage: false,

    showFirstOnEllipsisShow: true,

    showLastOnEllipsisShow: true,

    // Pagination callback
    callback: function() {}
  };

  // Hook register
  $.fn[pluginHookMethod] = function(hook, callback) {
    if (arguments.length < 2) {
      throwError('Missing argument.');
    }

    if (!$.isFunction(callback)) {
      throwError('callback must be a function.');
    }

    var container = $(this);
    var paginationData = container.data('pagination');

    if (!paginationData) {
      container.data('pagination', {});
      paginationData = container.data('pagination');
    }

    !paginationData.hooks && (paginationData.hooks = {});

    //paginationData.hooks[hook] = callback;
    paginationData.hooks[hook] = paginationData.hooks[hook] || [];
    paginationData.hooks[hook].push(callback);

  };

  // Static method
  $[pluginName] = function(selector, options) {
    if (arguments.length < 2) {
      throwError('Requires two parameters.');
    }

    var container;

    // 'selector' is a jQuery object
    if (typeof selector !== 'string' && selector instanceof jQuery) {
      container = selector;
    } else {
      container = $(selector);
    }

    if (!container.length) return;

    container.pagination(options);

    return container;
  };

  // ============================================================
  // helpers
  // ============================================================

  var Helpers = {};

  // Throw error
  function throwError(content) {
    throw new Error('Pagination: ' + content);
  }

  // Check parameters
  function parameterChecker(args) {
    if (!args.dataSource) {
      throwError('"dataSource" is required.');
    }

    if (typeof args.dataSource === 'string') {
      if (args.totalNumberLocator === undefined) {
        if (args.totalNumber === undefined) {
          throwError('"totalNumber" is required.');
        } else if (!$.isNumeric(args.totalNumber)) {
          throwError('"totalNumber" is incorrect. (Number)');
        }
      } else {
        if (!$.isFunction(args.totalNumberLocator)) {
          throwError('"totalNumberLocator" should be a Function.');
        }
      }
    } else if (Helpers.isObject(args.dataSource)) {
      if (typeof args.locator === 'undefined') {
        throwError('"dataSource" is an Object, please specify "locator".');
      } else if (typeof args.locator !== 'string' && !$.isFunction(args.locator)) {
        throwError('' + args.locator + ' is incorrect. (String | Function)');
      }
    }

    if (args.formatResult !== undefined && !$.isFunction(args.formatResult)) {
      throwError('"formatResult" should be a Function.');
    }
  }

  // uninstall plugin
  function uninstallPlugin(target) {
    var events = ['go', 'previous', 'next', 'disable', 'enable', 'refresh', 'show', 'hide', 'destroy'];

    // off events of old instance
    $.each(events, function(index, value) {
      target.off(eventPrefix + value);
    });

    // reset pagination data
    target.data('pagination', {});

    // remove old
    $('.paginationjs', target).remove();
  }

  // Object type detection
  function getObjectType(object, tmp) {
    return ( (tmp = typeof(object)) == "object" ? object == null && "null" || Object.prototype.toString.call(object).slice(8, -1) : tmp ).toLowerCase();
  }

  $.each(['Object', 'Array', 'String'], function(index, name) {
    Helpers['is' + name] = function(object) {
      return getObjectType(object) === name.toLowerCase();
    };
  });

  /*
   * export via AMD or CommonJS
   * */
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return $;
    });
  }

})(this, window.jQuery);

function load_images(bucket_url, items) {

    $(window).unbind('scroll');
    $('.search-images-col').html("");
    var initial_load = 9;
    var load_on_scroll = 3;
    var positions = masonry_load(bucket_url, items, 0, initial_load, 0);

    $(window).scroll(function() {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
            var idx = positions[0];
            var col = positions[1];
            if (idx <= items.length) {
                positions = masonry_load(bucket_url, items, idx, load_on_scroll, col);
            }
        }
    });
}

function masonry_load(bucket_url, items, image_index, images_to_load = 1, col = 0) {
    var load_to = image_index + images_to_load > items.length ? items.length : image_index + images_to_load
    for (var i = image_index; i < load_to; i++) {
        col = load_image(bucket_url, items[i], col)
    }
    return [i, col]
}

function load_image(bucket_url, item, col) {
    var img_tag = create_image_tag(bucket_url + item.PngPath, item.ItemId, item.VectorPath, item.Tags, item.PngPath)
    var is_fav_icon = is_favorite(item.ItemId) ? "favorite" : "favorite_border"
    var fav_icon = $('<i />').addClass('material-icons favorite search-favorite').text(is_fav_icon)
    var html = $("<div />").addClass('loaded-image').html(fav_icon)
    $(img_tag).appendTo(html)
    $('#search-images-col-' + (col + 1)).append(html);
    create_image_modal(img_tag);
    set_favorite(fav_icon, img_tag)
    return (col + 1) % 3;
}

function create_image_tag(src, id, VectorPath, tags, PngPath) {
    return $('<img>', { src: src, id: id, class: 'img-fluid modal-img' }).data({ vectorpath: VectorPath, pngpath: PngPath, tags: tags }).get(0)
}

function load_tag_selector(unique_tags_info) {
    unique_tags_info.forEach(tag_info => {
        const tag_html = '<option value="' + tag_info[0] + '">' + capitalize(tag_info[0]) + '</option>'
        $('.tag-selector').append(tag_html);
    });
}

function create_image_modal(img_tag) {
    $(img_tag).on('click', function() {
        var id = $(this).attr('id')
        var is_fav_icon = is_favorite(id) ? "favorite" : "favorite_border"
        var fav_icon = $('<i />').addClass('material-icons favorite modal-favorite').text(is_fav_icon)
        showBSModal({
            title: id,
            body: "<img src='" +
                $(this).attr('src') + "'" +
                "data-id='" + $(this).data('id') + "'" +
                "data-vectorpath='" + $(this).data('vectorpath') + "'" +
                "data-tags='" + $(this).data('tags') + "'" +
                "class='img-fluid modal-img'>" +
                "</br>" + $(this).data('tags') +
                fav_icon.get(0).outerHTML,
            size: "large",
            backdrop: true,
            actions: [{
                label: 'Cancel',
                cssClass: 'btn-success',
                onClick: function(e) {
                    console.log(e)
                    console.log(e.target)
                    $(e.target).parents('.modal').modal('hide');
                }
            }]
        });
        switch (windowLoc) {
            case "/search/edit":
                $("<a>", { href: bucket_url + $(this).data('vectorpath') }).text("Download Vector").appendTo($(".modal-body"))

                var delete_btn_obj = $("<a>", { href: '#', class: "delete-item" }).data({ dismiss: "modal" }).text("Delete").appendTo($(".modal-body"))
                delete_product_ajax(delete_btn_obj, id);
                break;
        }
        set_favorite($('.modal-favorite'), this);
        $('.modal').on('hidden.bs.modal', function(e) {
            update_favorite($(img_tag).prev(), img_tag)
        })
    });
}

function clear_favorites() {
    localStorage.clear()
}

function is_favorite(id) {
    return id in localStorage
}

function load_favorite_count() {
    $('#favorite-count').text(localStorage.length)
}

function load_favorites() {
    $('#show-favorites').on('click', function() {
        var items = []
        Object.keys(localStorage).forEach(function(key) {
            var item = localStorage.getItem(key)
            items.push(JSON.parse(item))
        });
        load_images(bucket_url, items)
    });
}


function update_favorite(fav_obj, item) {
    var id = $(item).attr('id')
    if (is_favorite(id)) {
        $(fav_obj).text("favorite")
        load_favorite_count()
    } else {
        $(fav_obj).text("favorite_border")
        load_favorite_count()
    }

}

function set_favorite(fav_icon, item) {
    $(fav_icon).on('click', function() {
        event.preventDefault();
        var id = $(item).attr('id')
        if (is_favorite(id)) {
            localStorage.removeItem(id)
            $(this).text("favorite_border")
            load_favorite_count()
        } else {
            $(this).text("favorite")
            localStorage.setItem($(item).attr('id'), JSON.stringify({ ItemId: $(item).attr('id'), VectorPath: $(item).data('vectorpath'), PngPath: $(item).data('pngpath'), Tags: $(item).data('tags') }));
            load_favorite_count()
        }
    });

}
var windowLoc = $(location).attr('pathname');
var local = true

var url_host = $(location).attr('host');

if (local) {
    var add_product_url = "http://127.0.0.1:5000/api/add-products";
    var product_url = "http://127.0.0.1:5000/api/product";
    var tags_url = "http://127.0.0.1:5000/api/tags";
    var all_products_url = "http://127.0.0.1:5000/api/search";
} else {
    var add_product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/add-products";
    var product_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/product";
    var tags_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/tags";
    var all_products_url = "http://tattoos-env.eu-west-2.elasticbeanstalk.com/api/search";
}


var bucket_url = "https://jf-test-bucket.s3.eu-west-2.amazonaws.com/";

// SEARCH PRODUCTS
function search_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: all_products_url,
        dataType: "json",
        success: function(response_object) {
            load_images(bucket_url, response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}

function search_unique_tags_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: tags_url,
        dataType: "json",
        success: function(response_object) {
            load_tag_selector(response_object.Body);
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}

function search_ajax_POST() {
    $('#search-word-button').on('click', function(event) {
        event.preventDefault();
        const word = $('#formSearchWord').val()
        search_word(word);
    })
}

function select_category_POST() {
    $('.tag-selector').on('change', function() {
        search_word(this.value);
    });
}

function menu_category_POST() {
    $('.menu_category').on('click', function() {
        event.preventDefault();
        word = $(this).text();
        search_word(word);
    });
}

function search_word(word) {
    var api_url = all_products_url + "/" + word;
    var method = "POST";
    if (!word || word.toLowerCase() == 'all') {
        api_url = all_products_url;
        method = "GET";
    };
    $.ajax({
        type: method,
        cache: false,
        url: api_url,
        dataType: "json",
        success: function(response_object) {
            load_images(bucket_url, response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}



// ADD PRODUCTS
function add_product_ajax_GET() {
    $.ajax({
        type: "GET",
        cache: false,
        url: tags_url,
        dataType: "json",
        success: function(response_object) {
            load_tag_cloud(response_object.Body)
        },
        error: function(jqXHR) {
            alert("error: " + jqXHR.status);
            console.log(jqXHR);
        }
    })
}

function add_product_ajax_POST() {
    $('#add-product-button').on('click', function(event) {
        event.preventDefault();
        const vector_file = document.getElementById('formVectorInput').files[0];
        const png_file = document.getElementById('formPngInput').files[0] ? document.getElementById('formPngInput').files[0] : false;
        const tags = get_product_tags();
        if (!vector_file) {
            alert_message("Add a vector file");
            return
        };
        if (!tags.length) {
            alert_message("Add at least one tag");
            return
        };
        var formData = new FormData();
        formData.append('vector_file', vector_file);
        formData.append('png_file', png_file);
        formData.append('tags', tags);

        $.ajax({
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            url: add_product_url,
            dataType: "json",
            success: function(response_object) {
                clear_add_product_form()
                if (response_object.ErrorCode != "OK") {
                    alert_message(response_object.Message)
                } else {
                    load_latest_added_product(response_object.PngPath, response_object.Body, response_object.Tags)
                }

            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}

function delete_product_ajax(html, item_id) {
    $(html).on('click', function(event) {
        event.preventDefault();

        $.ajax({
            type: "DELETE",
            cache: false,
            url: product_url + "/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
                $(e.target).parents('.modal').modal('hide');
                $("#" + item_id).remove()

            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })
}

function update_tags_ajax(element, item_id, tag_element) {
    $(element).on('click', function(event) {
        event.preventDefault();
        var tags = tag_element[0]["innerText"]

        $.ajax({
            type: "PUT",
            data: JSON.stringify({ "tags": tags }),
            contentType: "application/json",
            cache: false,
            url: product_url + "/" + item_id,
            dataType: "json",
            success: function(response_object) {
                alert(response_object.Message)
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
    })

}
$(function() {
    var windowLoc = $(location).attr('pathname');

    switch (windowLoc) {
        case "/":
            add_product_ajax_GET();
            add_tag();
            delete_tag();
            add_existing_tag();
            add_product_ajax_POST();
            break;
        case "/search":
            search_ajax_GET();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            menu_category_POST();
            load_favorite_count();
            load_favorites();
            break;
        case "/search/edit":
            search_ajax_GET();
            search_ajax_POST();
            search_unique_tags_GET();
            select_category_POST();
            menu_category_POST();
            load_favorite_count();
            load_favorites();
            break;
    }





});