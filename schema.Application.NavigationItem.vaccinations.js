var schema = require(USEGLOBAL('schemaExport/registerImport.js'))

schema.register('Application.NavigationItem', {
  disable: false,
  displayName: 'Vaccinations',
  name: 'vaccinations',
  order: 13,
  reference: 'Sharan.Vaccination',
  profile: [{ name: 'default' }],
})
