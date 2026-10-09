Ext.define("bootstrapper.treatmentHelpers", {
  statics: {
    statusExpand: function (field, opts) {
        opts = opts || {}
        var form = field?.up('form')
        if (!form.isValid()) {
          field?.collapse()
          Ext.Msg.alert(
            opts.title || 'שגיאה',
            opts.msg || ' נא למלא שדות חובה לפני שינוי סטטוס ',
          )
        }
      },
    setStateTreatToQuery: function (state, newVal) {
        if (newVal) {
          var wnd = state?.up('window')
          if (wnd) {
            var rec = wnd.rec
            if (rec) {
              var statusField = wnd.down('field[name=status]')
              var status = statusField.getStore()
              var proxy = status.getProxy()
              proxy.setExtraParam('state', newVal)
              status.load(function (records, operation, success) {
                if (!statusField.getValue()) {
                  statusField.setValue(rec.get('status'))
                }
              })
            }
          }
        }
      },
    treatmentEndDateAssigned: function (me, e) {
        var bDate = Ext.clone(me.get('startDateAssigned'))
        var dur = Ext.clone(me.get('durationAssigned'))
        if (bDate && dur) {
          me.set(
            'endDateAssigned',
            Ext.Date.add(new Date(bDate), Ext.Date.MINUTE, dur),
          )
        }
      },
    treatmentActualDuration: function (me, e) {
        var dur, eDate, bDate
        if (e?.propName == 'startDateActual') {
          bDate = Ext.clone(e?.newValue)
          dur = Ext.clone(me.get('durationActual'))
          eDate = Ext.clone(me.get('endDateActual'))
        } else if (e?.propName == 'endDateActual') {
          eDate = Ext.clone(e?.newValue)
          bDate = Ext.clone(me.get('startDateActual'))
          dur = Ext.clone(me.get('durationActual'))
        }
        if (bDate != null && eDate != null && bDate < eDate) {
          var bDateTime = bDate.getTime()
          var eDateTime = eDate.getTime()
          var duration = (eDateTime - bDateTime) / 60000
          duration = Math.floor(duration)
          me.set('durationActual', duration)
        }
      },
    treatmentNoteCC: function (btn) {
      var note = btn
      var parentWnd = note.up('window')
      var profileOfUser = window.APP_PROFILE
      var noteWnd = Ext.widget('window', {
        title: 'תיאור טיפול',
        extend: 'Ext.window.Window',
        resizable: false,
        modal: true,
        layout: 'fit',
        ctCls: 'right',
        width: 600,
        autoHeight: true,
        items: [
          {
            xtype: 'panel',
            border: 0,
            background: '#A2B1C5',
            items: [
              {
                layout: 'column',
                xtype: 'form',
                border: 0,
                bodyStyle: {
                  background: '#dfe9f6',
                },
                items: [
                  {
                    name: 'description',
                    text: 'כתוב תיאור',
                    margin: '5 10 10 10',
                    columnWidth: 1,
                    border: 5,
                    xtype: 'label',
                  },
                  {
                    name: 'textarea',
                    fieldLabel: '',
                    margin: '5 10 10 10',
                    columnWidth: 1,
                    border: 5,
                    xtype: 'textarea',
                  },
                ],
              },
            ],
          },
        ],
        buttons: [
          {
            name: 'buttonOK',
            text: 'אישור',
            width: 100,
            height: 23,
            xtype: 'button',
            listeners: {
              click: function (field) {
                var messageWnd = field?.up('window')
                var fieldNote = messageWnd.down('textarea')
                if (fieldNote && fieldNote.getValue()) {
                  var user = sessionStorage.fullNameEmployee
                  if (user === '' || user === undefined) {
                    user = 'default'
                  }
                  var newNote = ''
                  newNote =
                    user +
                    ' ' +
                    Ext.Date.format(new Date(), 'd-m-Y H:i:s') +
                    ' ' +
                    fieldNote.getValue() +
                    String.fromCharCode(13) +
                    String.fromCharCode(10) +
                    String.fromCharCode(13) +
                    String.fromCharCode(10)
                  var descriptionOrder = parentWnd.down(
                    'field[name=reasonForTreatment]',
                  )
                  var value = descriptionOrder.getValue()
                  descriptionOrder.setValue(newNote + value)
                }
                var wnd = field?.up('window')
                wnd.close()
              },
            },
          },
          {
            name: 'buttonCancel',
            text: 'ביטול',
            xtype: 'button',
            width: 75,
            height: 23,
            listeners: {
              click: function (field) {
                var wnd = field?.up('window')
                wnd.close()
              },
            },
          },
        ],
      })
      noteWnd.parentWnd = parentWnd
      noteWnd.show()
    },
    addressChange: function (me, addressChange, opts) {
      opts = opts || {};
      if (addressChange?.getValue()) {
        var form = addressChange?.up("window").down(".sharanaddressview");
        if (!form.widget) {
          Ext.MessageBox.show({
            title: opts.errorTitle || "Error",
            msg: opts.errorMsg || "Widget is undefined!",
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
          });
        } else {
          var clientOfTreatment = addressChange
            ?.up("form")
            .getRecord()
            .get("client");
          if (clientOfTreatment) {
            var MEC = me.application.getController(
              "Modeleditor.controller.Modeleditor"
            );
            MEC.dictionaryOneFn(form.down());
          }
        }
        addressChange?.setValue(false);
      }
    },
  },
  alternateClassName: "TreatmentHelpers",
});
