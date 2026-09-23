const saveWorker = require("./unifiedSaveWorkerPromises.js");
const log4js = require("log4js");
const loggerError = log4js.getLogger("error");

async function markVaccinationDone(para, context) {
  try {
    const prm = para.data && para.data[0] ? para.data[0] : {};
    const db = context.db;

    if (!prm.id) {
      context.failure("Vaccination id is required");
      return;
    }

    const vaccination = await db.model("Sharan.Vaccination").findById(prm.id);
    if (!vaccination) {
      context.failure("Vaccination is not found");
      return;
    }

    if (vaccination.get("status") === "cancelled") {
      context.failure("A cancelled vaccination cannot be marked as done");
      return;
    }

    const currentDate = vaccination.get("vaccinationDate");
    const stampedDate = currentDate || new Date();

    const changes = [
      { key: "status", from: vaccination.get("status"), to: "done" },
    ];
    if (!currentDate) {
      changes.push({ key: "vaccinationDate", from: "", to: stampedDate });
    }

    await saveWorker.unifiedSaveFunction(
      {
        entityName: "Sharan.Vaccination",
        action: "update",
        entityId: prm.id,
        changes: changes,
      },
      context
    );

    context.success({
      success: true,
      status: "done",
      vaccinationDate: stampedDate,
    });
  } catch (error) {
    loggerError.error("markVaccinationDone error: ", error);
    context.failure(error.message || error);
  }
}

Ext.directFn({
  namespace: "Modeleditor",
  name: "markVaccinationDone",
  body: function (para) {
    markVaccinationDone(para, this);
  },
});
