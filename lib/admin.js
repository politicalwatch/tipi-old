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
    Dicts: {
        icon: 'tag',
        tableColumns: [
          {label: 'Nombre', name: 'dict'},
          {label: 'Grupo', name: 'dictgroup'}
        ]
    },
    Refs: {
        icon: 'file',
        tableColumns: [
          {label: 'ObjectID', name: '_id'},
          {label: 'Título original', name: 'titulo'}
        ]
    },
    Meetups: {
        icon: 'calendar',
        tableColumns: [
          {label: 'Nombre', name: 'name'},
          {label: 'Descripción', name: 'description'},
          {label: 'Fecha', name: 'date'},
          {label: 'Activo?', name: 'active'}
        ]
    }
  }
}