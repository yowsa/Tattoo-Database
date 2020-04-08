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
        img: '',
        tags: '',
        icon_text: '',
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
    self.$modal.find('.modal-content').html('<div class="modal-body"><button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span class="material-icons">close</span></button>${img} ${body}<div class="row pt-3"><div class="col d-flex modal-tags">${tags}</div><div class="col d-flex h-100 justify-content-end"><i class="material-icons favorite modal-favorite">${icon_text}</i></div></div><span class="small-id">${title}</span></div>'.replace('${title}', options.title).replace('${body}', options.body).replace('${img}', options.img).replace('${tags}', options.tags).replace('${icon_text}', options.icon_text));

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