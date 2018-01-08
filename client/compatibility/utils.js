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


// Return initiative human state
function getHumanState(state) {
    var approved = {
        'text': 'Aprobada',
        'icon': 'check-circle',
        'color': 'green'
    }
    var converted = {
        'text': 'Convertida en otra',
        'icon': 'copy',
        'color': 'green'
    }
    var inprocess = {
        'text': 'En tramitación',
        'icon': 'gears',
        'color': 'black'
    }
    var cumulative = {
        'text': 'Acumulada en otra',
        'icon': 'copy',
        'color': 'green'
    }
    var cumulative = {
        'text': 'Acumulada en otra',
        'icon': 'copy',
        'color': 'green'
    }
    var cumulative = {
        'text': 'Acumulada en otra',
        'icon': 'copy',
        'color': 'green'
    }
    var notadmitted = {
        'text': 'No admitida a trámite',
        'icon': 'times-circle',
        'color': 'red'
    }
    var notdebated = {
        'text': 'No debatida',
        'icon': 'times-circle',
        'color': 'red'
    }
    var rejected = {
        'text': 'Rechazada',
        'icon': 'times-circle',
        'color': 'red'
    }
    var withdrawal = {
        'text': 'Retirada',
        'icon': 'times-circle',
        'color': 'red'
    }
    if (state.match(/Aprobado con modificaciones/gi)) {
        return approved;
    }
    if (state.match(/Aprobado sin modificaciones/gi)) {
        return approved;
    }
    if (state.match(/Convalidado/gi)) {
        return approved;
    }
    if (state.match(/Tramitado por completo sin/gi)) {
        return approved;
    }
    if (state.match(/Convertido/gi)) {
        return converted;
    }
    if (state.match(/Boletín Oficial de las Cortes Generales Publicación desde/gi)) {
        return inprocess;
    }
    if (state.match(/Comisión.*desde/gi)) {
        return inprocess;
    }
    if (state.match(/Concluído desde/gi)) {
        return inprocess;
    }
    if (state.match(/Gobierno Contestación/gi)) {
        return inprocess;
    }
    if (state.match(/Junta de Portavoces/gi)) {
        return inprocess;
    }
    if (state.match(/Mesa del Congreso Acuerdo/gi)) {
        return inprocess;
    }
    if (state.match(/Mesa del Congreso Requerimiento/gi)) {
        return inprocess;
    }
    if (state.match(/Pleno Aprobación desde/gi)) {
        return inprocess;
    }
    if (state.match(/Pleno desde/gi)) {
        return inprocess;
    }
    if (state.match(/Pleno Toma en consideración/gi)) {
        return inprocess;
    }
    if (state.match(/Solicitud de amparo/gi)) {
        return inprocess;
    }
    if (state.match(/Respuesta.*Gobierno/gi)) {
        return inprocess;
    }
    if (state.match(/Senado desde/gi)) {
        return inprocess;
    }
    if (state.match(/Subsumido en otra iniciativa/gi)) {
        return cumulative;
    }
    if (state.match(/Inadmitido a trámite/gi)) {
        return notadmitted;
    }
    if (state.match(/Decaído/gi)) {
        return notdebated;
    }
    if (state.match(/Rechazado/gi)) {
        return rejected;
    }
    if (state.match(/Retirado/gi)) {
        return withdrawal;
    }
    return {};
}



function builderQueryFrom(type) {
  var q = {}
  var enmienda = { numenmienda: {$exists: 1, $not: {$size: 0} } }
  var noenmienda = { $or: [{numenmienda: {$exists: 0}}, {numenmienda: {$size: 0}}] }
  switch(type) {
      case 'Comparecencias':
          q = {tipo: {$in: ["210", "212", "213", "219"]}}
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

//Query que traduce el estado de tramitacion en las regex posibles
function builderQueryByState(state) {
  var q = {}
  switch(state) {
      case 'aprobada':
          q = {$or: [
                  {tramitacion: {$regex: "Aprobado con modificaciones", $options: "gi"}},
                  {tramitacion: {$regex: "Aprobado sin modificaciones", $options: "gi"}},
                  {tramitacion: {$regex: "Convalidado", $options: "gi"}},
                  {tramitacion: {$regex: "Tramitado por completo sin", $options: "gi"}}
              ]}
          break;
      case 'rechazada':
          q = {tramitacion: {$regex: "Rechazado", $options: "gi"}}
          break;
      case 'tramitacion':
          q = {$or: [
                  {tramitacion: {$regex: "Boletín Oficial de las Cortes Generales Publicación desde", $options: "gi"}},
                  {tramitacion: {$regex: "Comisión.*desde", $options: "gi"}},
                  {tramitacion: {$regex: "Concluido desde", $options: "gi"}},
                  {tramitacion: {$regex: "Gobierno Contestación", $options: "gi"}},
                  {tramitacion: {$regex: "Junta de Portavoces", $options: "gi"}},
                  {tramitacion: {$regex: "Mesa del Congreso Acuerdo", $options: "gi"}},
                  {tramitacion: {$regex: "Mesa del Congreso Requerimiento", $options: "gi"}},
                  {tramitacion: {$regex: "Pleno Aprobación desde", $options: "gi"}},
                  {tramitacion: {$regex: "Pleno desde", $options: "gi"}},
                  {tramitacion: {$regex: "Pleno Toma en consideración", $options: "gi"}},
                  {tramitacion: {$regex: "Solicitud de amparo", $options: "gi"}},
                  {tramitacion: {$regex: "Respuesta.*Gobierno", $options: "gi"}},
                  {tramitacion: {$regex: "Senado desde", $options: "gi"}}
              ]}
          break;
      case 'noadmitida':
          q = {tramitacion: {$regex: "Inadmitido a trámite", $options: "gi"}}
          break;
      case 'nodebatida':
          q = {tramitacion: {$regex: "Decaído", $options: "gi"}}
          break;
      case 'retirada':
          q = {tramitacion: {$regex: "Retirado", $options: "gi"}}
          break;
      case 'convertida':
          q = {tramitacion: {$regex: "Convertido", $options: "gi"}}
          break;
      case 'acumulada':
          q = {tramitacion: {$regex: "Subsumido en otra iniciativa", $options: "gi"}}
          break;
      default:
          return {}
          break;
  }
  return q;
}

/* UTILS */

function builderQuery(cqry) {
    var fdesde, fhasta, newautor, newgrupootro, dict, terms, tramitacion;
    fdesde = fhasta = terms = null;
    newautor = newgrupootro = tipo = dict = tramitacion = {}
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
            terms = cqry[k];
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
        } else if ( k == "vtipo" && cqry[k] != "" ) {
            tipo = builderQueryFrom(cqry[k]);
            delete cqry[k];
        } else if ( k == "tramitacion" && cqry[k] != "" ) {
            tramitacion = builderQueryByState(cqry[k]);
            delete cqry[k];
        }
        else if (cqry[k] == "") {
            delete cqry[k];
        }
        else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
        }
    }
    if (tramitacion != {}) {
        jQuery.extend(cqry, tramitacion);
    }
    if (dict != {}) {
        jQuery.extend(cqry, dict);
    }
    if (terms) {
        if (dict != {}) {
            var termsbydict = {"terms.tipi": {$elemMatch: {"humanterm": {$in: terms}, "dict": dict["dicts.tipi"]}}}
            jQuery.extend(cqry, termsbydict);
        }
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
    total = stats.initiatives.all;
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
