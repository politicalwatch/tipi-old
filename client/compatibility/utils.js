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
          q = {tipo: {$in: ["1210", "211", "212", "213", "214", "219"]}}
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
    var fdesde, fhasta, newautor, newgrupootro;
    fdesde = fhasta = null;
    newautor = newgrupootro = tipo = {};
    for (var k in cqry) {
        if( k == "fechadesde" && cqry[k] != "" ) {
            fdesde = cqry[k];
            delete cqry[k];
        } else if(k == "fechahasta" && cqry[k] != "") {
            fhasta = cqry[k];
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
        } else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
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
    return cqry;
}


function cleanRefQuery(cqry) {
    var fdesde, fhasta, hayautor, tipoautor;
    fdesde = fhasta = null;
    hayautor = false;
    tipoautor = '';
    for (var k in cqry) {
        if( k == "fechadesde" && cqry[k] != "" ) {
            fdesde = cqry[k];
            delete cqry[k];
        } else if(k == "fechahasta" && cqry[k] != "") {
            fhasta = cqry[k];
            delete cqry[k];
        } else if (k == "autor") {
            hayautor = true;
        } else if (k == "tipoautor") {
            tipoautor = cqry[k];
            delete cqry[k];
        } else if (cqry[k] == "") {
            delete cqry[k];
        } else if (typeof(cqry[k]) != "object") {
            cqry[k] = {$regex: cqry[k], $options: "gi"};
        }
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
    if (hayautor) {
        newautor = {};
        if (tipoautor == 'diputado') {
            newautor = { 'autor.diputado': {$regex: cqry['autor'], $options: "gi"} }
        } if (tipoautor == 'grupo') {
            newautor = { 'autor.grupo': {$regex: cqry['autor'], $options: "gi"} }
        } if (tipoautor == 'otro') {
            newautor = { 'autor.otro': {$regex: cqry['autor'], $options: "gi"} }
        } else {
            //
        }
        delete cqry['autor'];
        jQuery.extend(cqry, newautor);
    }
    return cqry;
}



/* Clean data funcions */

function cleanBol(el) {
    if (typeof el.bol !== 'undefined') {
        if (typeof el.bol.bol !== 'undefined') {return el.bol.bol;
        } else {
            return el.bol;
        }
    } else {
        return '';
    }
}
function cleanTramite(el) {
    if (typeof el.tramite !== 'undefined') {
        if (typeof el.tramite.tramite !== 'undefined') {
            return el.tramite.tramite;
        } else {
            if (_.isArray(el.tramite)) {
                return el.tramite[0];
            } else {
                return el.tramite;
            }
        }
    } else {
        return '';
    }
}
function cleanUrl(el) {
    if (typeof el.url !== 'undefined') {
        if (typeof el.url.url !== 'undefined') {return el.url.url;
        } else {
            // If it has more than one url, it returns just one
            if (Array.isArray(el.url)) {
                return el.url[0];
            } else {
                return el.url;
            }
        }
    } else {
        return '';
    }
}
function parseAutorDiputado(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.diputado !== 'undefined') && (el.autor.diputado != '')) {
            if (Array.isArray(el.autor.diputado)) {
                els = [];
                _.each(el.autor.diputado, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.diputado];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorGrupo(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.grupo !== 'undefined') && (el.autor.grupo != '')) {
            if (Array.isArray(el.autor.grupo)) {
                els = [];
                _.each(el.autor.grupo, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.grupo];
            }
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorOtro(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.otro !== 'undefined') && (el.autor.otro != '')) {
            if (Array.isArray(el.autor.otro)) {
                els = [];
                _.each(el.autor.otro, function(e){
                    els.push(e);
                });
                return els;
            } else {
                return [el.autor.otro];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
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
