/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */

Template.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});

Handlebars.registerHelper('myHelper', function(myArgument){
    return "Hello, " + myArgument;
});

Handlebars.registerHelper('', function(section){
  return "";
});
