const ComplexQuery = require("@grainjs/loaders").ComplexQuery;
const { promisify } = require("util");
const execQuery = promisify(ComplexQuery.execQuery);

const SEARCH_FIELDS =
  "vaccineName vaccinationDate doseNumber batchNumber status administeredBy hadReaction reactionDescription comment vaccinationId";

async function searchVaccination(para, context) {
  try {
    const prm = para.data && para.data[0] ? para.data[0] : {};
    const db = context.db;
    const q = prm?.query?.sharanvaccination;
    if (!q) {
      context.success([]);
      return;
    }

    const { vaccineName, batchNumber, ...rest } = q;
    const term = vaccineName ?? batchNumber;

    const mainQuery = {
      model: "Sharan.Vaccination",
      conditions: term
        ? { ...rest, $or: [{ vaccineName: term }, { batchNumber: term }] }
        : rest,
      fields: SEARCH_FIELDS,
    };

    const data = await execQuery(db, mainQuery);
    context.success(data);
  } catch (error) {
    context.failure(error);
  }
}

Ext.directFn({
  namespace: "QueryService",
  name: "searchVaccination",
  body: function (para) {
    searchVaccination(para, this);
  },
});

if (typeof global.GenericSearchQueries === "undefined")
  global.GenericSearchQueries = {};

global.GenericSearchQueries["QueryService.searchVaccination"] = function () {
  return {
    model: "Sharan.Vaccination",
    fields: SEARCH_FIELDS,
  };
};
