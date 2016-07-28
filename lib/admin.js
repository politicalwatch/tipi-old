AdminConfig = {
  name: 'TIPI Backend',
  skin: 'blue',
  adminEmails: [
    'edipotrebol@gmail.com',
    'alba.gutierrez@ciecode.es',
    'javier.perez@ciecode.es',
    'raul.martin@ciecode.es'
  ],
  collections: {
    Tipis: {
        icon: 'file',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Título', name: 'titulo'}
        ]
    },
    Grupos: {
        icon: 'institution',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Nombre', name: 'nombre'},
          {label: 'Acrónimo', name: 'acronimo'}
        ]
    },
    Diputados: {
        icon: 'institution',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Nombre', name: 'nombre'},
          {label: 'Grupo', name: 'grupo'}
        ]
    },
    Dicts: {
        icon: 'tag',
        tableColumns: [
          {label: 'Nombre', name: 'dict'},
          {label: 'Grupo', name: 'dictgroup'}
        ]
    },
  }
}
