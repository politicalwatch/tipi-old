/* ---------------------------------------------------- +/

## Public Tipi ##

Code related to the public tipi template

/+ ---------------------------------------------------- */

Meteor.subscribe('singlePostByUrl', window.location.href);


Template.tipipublic.rendered = function () {
    post = Posts.find().fetch();
    if (post.length > 0) {
        $('.discusslink').html("<i class='fa fa-comments-o'></i> Unirme a la conversación");
        $('.discusslink').attr('href', '/forum/posts/'+post[0]._id);
    } else {
        $('.discusslink').html("<i class='fa fa-comments-o'></i> Iniciar una conversación");
        $('.discusslink').attr('id', 'init-discussion');
        $('.discusslink').attr('href', '#');
    }
};

Template.tipipublic.helpers({
    goToConversation: function() {
        post = Posts.find().fetch();
        if (post.length > 0) {
            link = '/forum/posts/'+post[0]._id;
        } else {
            link = '/forum/add?url='+window.location.href+'topics='+this.dicts;
        }
        return link;
    },
    groupsHumanized: function() {
        groups = [];
        for(i=0;i<this.autor_grupo.length;i++) {
            groups.push(parliamentarygroups[this.autor_grupo[i]]);
        }
        return groups;
    },
    qpcClass: function() {
        if (this.quepasocon.toLowerCase() == 'cumplido') {
            return 'complete';
        } else if (this.quepasocon.toLowerCase() == 'no cumplido') {
            return 'uncomplete';
        } else if (this.quepasocon.toLowerCase() == 'parcialmente cumplido') {
            return 'partially';
        } else {
            return 'pending';
        }
    },
    qpcIcon: function() {
        if (this.quepasocon.toLowerCase() == 'cumplido') {
            return 'check-circle';
        } else if (this.quepasocon.toLowerCase() == 'no cumplido') {
            return 'minus-circle';
        } else if (this.quepasocon.toLowerCase() == 'parcialmente cumplido') {
            return 'adjust';
        } else {
            return 'clock-o';
        }
    }
});

Template.tipipublic.events({
    // 'click #toogle-content': function(e) {
    //     e.preventDefault();
    //     if ($('#content-block').hasClass('hide')) {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-up"></i> Ocultar contenido <i class="fa fa-angle-double-up"></i>');
    //         $('#content-block').removeClass('hide');
    //     } else {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-down"></i> Mostrar contenido <i class="fa fa-angle-double-down"></i>');
    //         $('#content-block').addClass('hide');
    //     }
    // },
    'click #back': function(e) {
		e.preventDefault();
		history.back();
	},
    'click #init-discussion': function(e) {
        e.preventDefault();
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    },
    'click #start-conversation': function(e) {
        e.preventDefault();
        var post = {
            url: window.location.href,
            title: ($('#conversation-title').val() != "") ? $('#conversation-title').val() : this.tipi.titulo_alt,
            topics: this.tipi.dicts
        };
        Meteor.call('postInsert', post, function(error, result) {
            // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }
            // show this result but route anyway
            if (result.postExists) {
                throwError('This link has already been posted');
            }
            Router.go('postPage', {_id: result._id});  
        });
    },
    'click #close-dialog': function(e) {
        e.preventDefault();
        document.getElementById("overlay").style.visibility = 'hidden';
    }
});