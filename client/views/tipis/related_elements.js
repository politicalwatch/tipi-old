Template.related_elements.helpers({
    getAutor: function() {
        if (!_.isEmpty(this.autor_grupo)) {
            return this.autor_grupo;
        } else {
            return this.autor_otro;
        }
    }
});
