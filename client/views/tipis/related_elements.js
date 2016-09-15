Template.related_elements.helpers({
    getAutor: function() {
        console.log(this.autor_grupo);
        console.log(this.autor_otro);
        if (!_.isEmpty(this.autor_grupo)) {
            return this.autor_grupo;
        } else {
            return this.autor_otro;
        }
    }
});
