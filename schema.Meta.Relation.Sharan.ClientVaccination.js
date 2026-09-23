var schema = require(USEGLOBAL('schemaExport/registerImport.js'))

schema.register('Meta.Relation', {
  collectionType: 'sharan.rels.clientvaccination',
  name: 'Sharan.ClientVaccination',
  namespace: 'Sharan',
  settings: [
    {
      destDisplayName: 'Vaccinations',
      destGroup: 'General',
      destOrder: 1,
      destRequired: true,
      destThing: 'Sharan.Vaccination',
      name: 'ClientVaccination',
      relName: 'Sharan.ClientVaccination',
      sourceDisable: true,
      sourceDisplayName: 'Client',
      sourceOrder: 1,
      sourceRequired: true,
      toolbardest: 'crRemRef',
    },
  ],
  dest: {
    name: 'vaccination',
    required: false,
    thingType: 'Sharan.Vaccination',
  },
  source: {
    cardinality: '1',
    name: 'client',
    thingType: 'Sharan.TemplateClient',
  },
})
