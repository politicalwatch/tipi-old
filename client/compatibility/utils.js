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

var datepickeroptions = {
    format: "dd/mm/yyyy",
    todayHighlight: true
}

// Generate app based collection ids
function generateId(id) {
    // Id based on Mongo ObjectIds
    return new Mongo.ObjectID(id);
}

// Generate Congreso url from ref
// Nota importante: Esta función la necesitamos porque la url que tiene cada objeto de tipo iniciativa no es unívoca
// ya que contiene un número de orden que cambia dependiendo cuando se haya lanzado su procesamiento por lotes.
// Con generateCongresoUrl generamos urls unívovas a iniciativas
function generateCongresoUrl(ref) {
    sref = ref.split("/");
    return "http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW12&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=("+sref[0]+"%2F"+sref[1]+"*.NDOC.)";
}

function builderQueryFrom(type) {
  var q = {}
  var enmienda = { numenmienda: {$exists: 1, $not: {$size: 0} } }
  var noenmienda = { $or: [{numenmienda: {$exists: 0}}, {numenmienda: {$size: 0}}] }
  switch(type) {
      case 'Comparecencias':
          q = {tipo: {$in: ["212", "210", "213", "219"]}}
          break;
      case 'Convenios internacionales':
          q = {tipo: {$in: ["110", "111", "112"]}}
          break;
      case 'Creación de comisiones, subcomisiones y ponencias':
          q = {tipo: {$in: ["151", "152", "153", "154", "155", "156", "157", "158"]}}
          break;
      case 'Interpelación y su respuesta':
          q = {tipo: {$in: ["170", "172"]}}
          break;
      case 'Moción consecuencia de interpelación y sus enmiendas':
          q = {tipo: "173"}
          break;
      case 'Otros actos y sus enmiendas':
          q = {tipo: {$in: ["200", "140", "120", "095", "189", "187", "410", "156", "193"]}}
          break;
      case 'Planes, programas y dictámenes':
          q = {tipo: "043"}
          break;
      case 'Pregunta oral y su respuesta':
          q = {tipo: {$in: ["180", "181"]}}
          break;
      case 'Pregunta para respuesta escrita y su respuesta':
          q = {tipo: "184"}
          break;
      case 'Proposición de ley y sus enmiendas':
          q = {tipo: {$in: ["122", "123", "124", "125"]}}
          break;
      case 'Proposición no de ley y sus enmiendas':
          q = {tipo: {$in: ["161", "162"]}}
          break;
      case 'Proyecto de Ley y sus enmiendas':
          q = {tipo: "121"}
          break;      
      case 'Real decreto legislativo':
          q = {tipo: "132"}
          break;      
      case 'Real decreto-ley':
          q = {tipo: "130"}
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
        else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
        }
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
        cqry["actualizacion"] = {
            $gte: datestringToISODate(fdesde, true),
            $lte: datestringToISODate(fhasta, false)
        };
    } else if (fdesde != null && fhasta == null) {
        cqry["actualizacion"] = {
            $gte: datestringToISODate(fdesde, true)
        };
    } else if (fdesde == null && fhasta != null) {
        cqry["actualizacion"] = {
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
