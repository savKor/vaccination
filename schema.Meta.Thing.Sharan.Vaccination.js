var schema = require(USEGLOBAL("schemaExport/registerImport.js"));

schema.register("Meta.Thing", {
  collectionType: "sharan.things.vaccination",
  defaultQuery: "ReadByQuery.SharanVaccination",
  defaultRefresh: "ReadByQuery.SharanVaccination",
  legacySearch: true,
  namespace: "Sharan",
  searchQuery: "QueryService.searchVaccination",
  thingType: "Sharan.Vaccination",
  clientMethods: [
    {
      body: function hadReactionChange(field) {
        var me = this;
        me.syncReactionDescription(field?.up("sharanvaccinationedit"));
      },
      comment:
        "Toggles reactionDescription when the Had Reaction checkbox changes.",
      event: "change",
      name: "hadReactionChange",
      params: "field",
      selector: "sharanvaccinationedit field[name=hadReaction]",
      type: "listener",
    },
    {
      body: function makeFieldRequired(field) {
        var req = '<span style="color:red;" data-qtip="Required">*</span>';
        Ext.apply(
          field,
          {
            allowBlank: false,
          },
          {}
        );
        if (
          field?.labelEl &&
          !/<span style=\"color:red;\" data-qtip=\"Required\">\*<\/span>/.test(
            field?.labelEl?.dom?.innerHTML
          )
        ) {
          field.labelEl.dom.innerHTML = field?.labelEl?.dom?.innerHTML + req;
        }
      },
      name: "makeFieldRequired",
      params: "field",
      type: "common",
    },
    {
      body: function makeFieldUnrequired(field) {
        Ext.apply(
          field,
          {
            allowBlank: true,
          },
          {}
        );
        if (
          field?.labelEl &&
          /<span style=\"color:red;\" data-qtip=\"Required\">\*<\/span>/.test(
            field?.labelEl?.dom?.innerHTML
          )
        ) {
          field.labelEl.dom.innerHTML = field?.labelEl?.dom?.innerHTML?.replace(
            /\<span(.*)>(.*)\<\/span\>/,
            ""
          );
        }
      },
      name: "makeFieldUnrequired",
      params: "field",
      type: "common",
    },
    {
      body: function markVaccinationDone(btn) {
        var form = btn?.up("sharanvaccinationedit");
        var rec = form?.up("window")?.rec;
        if (!rec) return;
        Modeleditor.markVaccinationDone(
          { id: rec.get("_id") },
          function (result, responseText) {
            if (!result || result.success === false) {
              Ext.MessageBox.alert(
                "Error",
                result?.message ||
                  responseText?.result?.errors ||
                  "Mark as done failed"
              );
              return;
            }
            var statusField = form?.down("field[name=status]");
            var dateField = form?.down("field[name=vaccinationDate]");
            if (statusField) statusField.setValue(result.status);
            if (dateField && result.vaccinationDate) {
              dateField.setValue(new Date(result.vaccinationDate));
            }
            Ext.MessageBox.alert("Success", "Vaccination marked as done");
          }
        );
      },
      displayName: "Mark as done",
      name: "markVaccinationDone",
      params: "btn",
      type: "button",
      clientmethodsettings: [
        {
          columnWidth: 0.2,
          hidden: false,
          order: 9,
          settingsName: "markVaccinationDone",
          showInsideForm: true,
          fieldset: { displayName: "Vaccination" },
        },
      ],
    },
    {
      body: function putTodayDate(btn) {
        var form = btn?.up("sharanvaccinationedit");
        var dateField = form?.down("field[name=vaccinationDate]");
        if (dateField) dateField.setValue(new Date());
      },
      displayName: "Today",
      name: "putTodayDate",
      params: "btn",
      type: "button",
      clientmethodsettings: [
        {
          columnWidth: 0.1,
          hidden: false,
          order: 2,
          settingsName: "putTodayDate",
          showInsideForm: true,
          fieldset: { displayName: "Vaccination" },
        },
      ],
    },
    {
      body: function syncReactionDescription(form) {
        var me = this;
        if (!form) return;
        var checkbox = form?.down("field[name=hadReaction]");
        var descField = form?.down("field[name=reactionDescription]");
        if (!descField) return;
        var hadReaction = checkbox ? checkbox.getValue() === true : false;
        if (hadReaction) {
          descField.show();
          descField.enable();
          me.makeFieldRequired(descField);
          descField.validate();
        } else {
          me.makeFieldUnrequired(descField);
          if (descField.clearInvalid) descField.clearInvalid();
          descField.hide();
          descField.disable();
        }
      },
      name: "syncReactionDescription",
      params: "form",
      type: "common",
    },
    {
      body: function vaccinationFormAfterRender(form) {
        var me = this;
        me.syncReactionDescription(form);
      },
      event: "afterrender, show",
      name: "vaccinationFormAfterRender",
      params: "form",
      selector: "sharanvaccinationedit",
      type: "listener",
    },
  ],
  fieldset: [
    { collapsible: true, displayName: "Vaccination", order: 10000 },
    { collapsible: true, displayName: "Reaction", order: 10001 },
  ],
  properties: [
    {
      clientRequired: true,
      index: 1,
      fieldset: "Vaccination",
      propertyName: "vaccineName",
      required: true,
      type: "string",
      formview: [
        {
          columnWidth: 1,
          displayName: "Vaccine",
          emptyText: "Choose",
          fieldtype: "combobox",
          grow: false,
          labelWidth: 130,
          order: 0,
          required: true,
          comboData: {
            data: [
              { name: "Influenza", value: "Influenza" },
              { name: "Pneumococcal", value: "Pneumococcal" },
              { name: "COVID-19", value: "COVID-19" },
              { name: "Hepatitis B", value: "Hepatitis B" },
              { name: "Tetanus", value: "Tetanus" },
            ],
          },
        },
      ],
      gridview: [
        {
          columnText: "Vaccine",
          filterable: true,
          hidden: false,
          order: 1,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      clientRequired: true,
      index: 1,
      fieldset: "Vaccination",
      propertyName: "vaccinationDate",
      required: true,
      type: "date",
      formview: [
        {
          columnWidth: 0.4,
          displayName: "Vaccination Date",
          fieldtype: "datefield",
          format: "d-m-Y",
          grow: false,
          labelWidth: 130,
          order: 1,
          required: true,
        },
      ],
      gridview: [
        {
          columnText: "Vaccination Date",
          columntype: "datecolumn",
          filterable: true,
          format: "d-m-Y",
          hidden: false,
          order: 2,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Vaccination",
      propertyName: "doseNumber",
      type: "integer",
      formview: [
        {
          columnWidth: 0.4,
          displayName: "Dose Number",
          fieldtype: "numberfield",
          format: "0",
          grow: false,
          labelWidth: 130,
          order: 3,
        },
      ],
      gridview: [
        {
          columnText: "Dose Number",
          columntype: "numbercolumn",
          filterable: true,
          format: "0",
          hidden: false,
          order: 3,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Vaccination",
      propertyName: "batchNumber",
      type: "string",
      formview: [
        {
          columnWidth: 0.5,
          displayName: "Batch Number",
          grow: false,
          labelWidth: 130,
          order: 4,
        },
      ],
      gridview: [
        {
          columnText: "Batch Number",
          filterable: true,
          hidden: false,
          order: 4,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Reaction",
      propertyName: "hadReaction",
      type: "boolean",
      formview: [
        {
          columnWidth: 0.5,
          displayName: "Had Reaction",
          fieldtype: "checkbox",
          grow: false,
          labelWidth: 130,
          order: 10,
        },
      ],
      gridview: [
        {
          columnText: "Had Reaction",
          columntype: "booleancolumn",
          filterable: true,
          hidden: false,
          order: 7,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Reaction",
      propertyName: "reactionDescription",
      type: "string",
      formview: [
        {
          displayName: "Reaction Description",
          fieldtype: "textareafield",
          grow: false,
          hidden: true,
          labelWidth: 130,
          order: 11,
        },
      ],
      gridview: [
        {
          columnText: "Reaction Description",
          filterable: true,
          flex: 1,
          hidden: false,
          order: 8,
          sortable: false,
        },
      ],
    },
    {
      fieldset: "Vaccination",
      propertyName: "administeredBy",
      type: "string",
      formview: [
        {
          columnWidth: 0.5,
          comboForcePreload: true,
          displayName: "Administered By",
          emptyText: "Choose",
          fieldtype: "combobox",
          grow: false,
          labelWidth: 130,
          order: 6,
          comboData: {
            displayField: "fullNameEmployee",
            store: "Sharan.Employee",
            valueField: "fullNameEmployee",
          },
        },
      ],
      gridview: [
        {
          columnText: "Administered By",
          filterable: true,
          hidden: false,
          order: 6,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Vaccination",
      propertyName: "status",
      type: "string",
      formview: [
        {
          columnWidth: 0.5,
          displayName: "Status",
          fieldtype: "combobox",
          grow: false,
          labelWidth: 130,
          order: 5,
          value: "planned",
          comboData: {
            data: [
              { name: "Planned", value: "planned" },
              { name: "Done", value: "done" },
              { name: "Cancelled", value: "cancelled" },
            ],
          },
        },
      ],
      gridview: [
        {
          columnText: "Status",
          filterable: true,
          hidden: false,
          order: 5,
          sortable: true,
          width: 0,
        },
      ],
    },
    {
      fieldset: "Vaccination",
      propertyName: "comment",
      type: "string",
      formview: [
        {
          displayName: "Comment",
          fieldtype: "textareafield",
          grow: false,
          labelWidth: 130,
          order: 7,
        },
      ],
      gridview: [
        {
          columnText: "Comment",
          filterable: true,
          flex: 1,
          hidden: true,
          order: 9,
          sortable: false,
        },
      ],
    },
    {
      autoInc: true,
      index: 1,
      fieldset: "Vaccination",
      propertyName: "vaccinationId",
      sparse: true,
      type: "integer",
      unique: true,
      formview: [
        {
          columnWidth: 0.5,
          displayName: "Vaccination Id",
          fieldtype: "numberfield",
          format: "0",
          grow: false,
          hidden: true,
          labelWidth: 130,
          order: 8,
          readOnly: true,
        },
      ],
      gridview: [
        {
          columnText: "Vaccination Id",
          columntype: "numbercolumn",
          filterable: true,
          format: "0",
          hidden: false,
          order: 0,
          sortable: true,
          width: 0,
        },
      ],
    },
  ],
  sortProperty: [{ direction: "DESC", property: "vaccinationDate" }],
});
