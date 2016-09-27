ShareIt.configure({
    sites: {
        'facebook': {
            'appId': "1662188644096441"
        },
        'twitter': {},
        'googleplus': null,
        'pinterest': null
    },
    classes: "btn",
    iconOnly: false,
    applyColors: true,
});

var alias_tipi_dicts = {
    'dependencia': 'Dependencia',
    'infancia': 'Infancia',
    'cambio climático y política energética': 'Cambio climático',
    'vivienda': 'Vivienda',
    'sanidad': 'Sanidad',
    'empleo': 'Empleo',
    'personas sin hogar': 'Sinhogarismo',
    'educación': 'Educación',
    'comercio internacional': 'Comercio',
    'cooperación al desarrollo': 'Cooperación',
    'transparencia y acceso a información': 'Transparencia',
    'conductas adictivas': 'Adicciones',
    'personas mayores': 'Mayores',
    'población reclusa': 'Reclusos',
    'migraciones': 'Migraciones',
    'población gitana': 'Pob. gitana',
    'conflictos internacionales y construcción de paz': 'Conflictos',
    'igualdad de género': 'Género',
    'protección social': 'Protección social',
    'personas con discapacidad': 'Discapacidad',
    'fiscalidad': 'Fiscalidad'
}

var parliamentarygroups = {
    'GP': 'Grupo Popular',
    'GS': 'Grupo Socialista',
    'GC-CiU': 'Grupo Catalán - Convergencia i Unió',
    'GIP': 'Grupo La Izquierda Plural',
    'GV (EAJ-PNV)': 'Grupo Vasco - EAJ PNV',
    'GUPyD': 'Grupo Unión Progreso y Democracia',
    'GMx': 'Grupo Mixto'
}

var parliamentarygroups_colors = {
    'GP': '#58c3ed',
    'GS': '#e61a26',
    'GC-CiU': '#254a90',
    'GIP': '#c71431',
    'GV (EAJ-PNV)': '#489334',
    'GUPyD': '#e10e83',
    'GMx': '#fabb2e'
}

var datepickeroptions = {
    format: "dd/mm/yyyy",
    todayHighlight: true
}

// Generate app based collection ids
function generateId(id) {
    // Id based on Mongo ObjectIds
    return new Mongo.ObjectID(id);
}

function builderQueryFrom(type) {
  var q = {}
  var enmienda = { numenmienda: {$exists: 1, $not: {$size: 0} } }
  var noenmienda = { $or: [{numenmienda: {$exists: 0}}, {numenmienda: {$size: 0}}] }
  switch(type) {
      case 'Proyecto de Ley':
          q = {tipo: "121"}
          jQuery.extend(q, noenmienda);
          break;
      case 'Enmienda a Proyecto de Ley':
          q = {tipo: "121"}
          jQuery.extend(q, enmienda);
          break;
      case 'Proposición de Ley':
          q = {tipo: {$in: ["120", "122", "123", "125"]}}
          jQuery.extend(q, noenmienda);
          break;
      case 'Enmienda a Proposición de Ley':
          q = {tipo: {$in: ["120", "122", "123", "125"]}}
          jQuery.extend(q, enmienda);
          break;
      case 'Real Decreto Ley':
          q = {tipo: "130"}
          break;
      case 'Real Decreto Legislativo':
          q = {tipo: "132"}
          break;
      case 'Comisiones, Subcomisiones y Ponencias':
          q = {tipo: {$in: ["154", "155", "156", "158"]}}
          jQuery.extend(q);
          break;
      case 'Proposición no de Ley':
          q = {tipo: {$in: ["161", "162"]}}
          jQuery.extend(q, noenmienda);
          break;
      case 'Enmienda a Proposición no de Ley':
          q = {tipo: {$in: ["161", "162"]}}
          jQuery.extend(q, enmienda);
          break;
      case 'Interpelación':
          q = {tipo: {$in: ["170", "172"]}}
          break;
      case 'Moción consecuencia de Interpelación':
          q = {tipo: "173"}
          jQuery.extend(q, noenmienda);
          break;
      case 'Enmienda a Moción':
          q = {tipo: "173"}
          jQuery.extend(q, enmienda);
          break;
      case 'Pregunta oral':
          q = {tipo: {$in: ["178", "180", "181"]}}
          break;
      case 'Pregunta para respuesta escrita':
          q = {tipo: {$in: ["179", "184"]}}
          break;
      case 'Comparecencia':
          q = {tipo: {$in: ["210", "211", "212", "213", "214", "219"]}}
          break;
      case 'Planes, Programas y Dictámenes':
          q = {tipo: "043"}
          break;
      default:
          return {}
          break;
  }
  return q;
}


/* UTILS */

function cleanTipiQuery(cqry) {
    var fdesde, fhasta, newautor, newgrupootro, dict, term;
    fdesde = fhasta = null;
    newautor = newgrupootro = tipo = dict = term = {};
    for (var k in cqry) {
        if (k == "fechadesde" && cqry[k] != "" ) {
            fdesde = cqry[k];
            delete cqry[k];
        } else if (k == "fechahasta" && cqry[k] != "") {
            fhasta = cqry[k];
            delete cqry[k];
        } else if (k == 'dicts' && cqry[k] != "") {
            dict = {"dicts.tipi": cqry[k]}
            delete cqry[k];
        } else if (k == 'terms' && cqry[k] != "") {
            term = {"terms.tipi.humanterm": cqry[k]}
            delete cqry[k];
        } else if ((k == "autor") && (cqry[k] != "")) {
            newautor = { 'autor_diputado': {$regex: cqry['autor'], $options: "gi"} }
            delete cqry[k];
        } else if ((k == "grupootro") && (cqry[k] != "")) {
            if (cqry['grupootro'] == 'Gobierno') {
                newgrupootro = { 'autor_otro': cqry['grupootro'] }
            } else {
                newgrupootro = { 'autor_grupo': cqry['grupootro'] }
            }
            delete cqry[k];
        } else if( k == "vtipo" && cqry[k] != "" ) {
            tipo = builderQueryFrom(cqry[k]);
            delete cqry[k];
        }
        else if (cqry[k] == "") {
            delete cqry[k];
        }
        // else if (typeof(cqry[k]) != "object") {
        //     cqry[k] = {$regex: cqry[k], $options: "gi"};
        // }
    }
    if (dict != {}) {
        jQuery.extend(cqry, dict);
    }
    if (term != {}) {
        jQuery.extend(cqry, term);
    }
    if (newautor != {}) {
        jQuery.extend(cqry, newautor);
    }
    if (newgrupootro != {}) {
        jQuery.extend(cqry, newgrupootro);
    }
    if (tipo != {}) {
        jQuery.extend(cqry, tipo);
    }
    if (fdesde != null && fhasta != null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true),
            $lte: datestringToISODate(fhasta, false)
        };
    } else if (fdesde != null && fhasta == null) {
        cqry["fecha"] = {
            $gte: datestringToISODate(fdesde, true)
        };
    } else if (fdesde == null && fhasta != null) {
        cqry["fecha"] = {
            $lte: datestringToISODate(fhasta, false)
        };
    }
    jQuery.extend(cqry, {"is.tipi": true});
    return cqry;
}


function getOverallStats(n) {
    if (typeof n !== "undefined") elements_in_vizz = n;
    else elements_in_vizz = Dicts.find().count();
    stats = TipiStats.find().fetch()[0];
    overall = _.sortBy(stats.overall, function(item) { return item.count; });
    dicts = Dicts.find().fetch();
    data = [];
    total = Session.get('total-initiatives');
    for(i=overall.length-1;i>overall.length-1-elements_in_vizz;i--) {
        percentage = parseFloat((overall[i]['count']/total)*100).toFixed(2);
        data.push({
            'title': overall[i]['_id'],
            'subtitle': percentage+"%",
            'slug': _.find(dicts, function(d) { return d.name == overall[i]['_id']; }).slug,
            'ranges': [total],
            'measures': [overall[i]['count']]}
        );
    }
    return data;
}


// congreso.es URL maker
function parseCongresoURL(ref) {
    var split_ref = ref.split('/');
    return "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWA0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28"+split_ref[0]+"%2F"+split_ref[1]+"%29.";
}

// The parameter isfrom indicates that it will be the start of the day
function datestringToISODate(d, isfrom) {
    var dparts = d.split("/");
    if (isfrom) {
        return new Date(dparts[2], dparts[1]-1, dparts[0], 0, 0, 0)
    } else {
        return new Date(dparts[2], dparts[1]-1, dparts[0], 23, 59, 59)
    }
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase();  });
};
