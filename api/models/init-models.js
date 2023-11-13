// var DataTypes = require("sequelize").DataTypes;
// var _discipline = require("./discipline");
// var _distributed_load = require("./distributed_load");
// var _groups = require("./groups");
// var _post = require("./post");
// var _professors = require("./professor");
// var _quizzes = require("./quiz");
// var _students = require("./student");
// var _teacher = require("./teacher");
// var _workload = require("./workload");
// //
// function initModels(sequelize) {
//   var discipline = _discipline(sequelize, DataTypes);
//   var distributed_load = _distributed_load(sequelize, DataTypes);
//   var groups = _groups(sequelize, DataTypes);
//   var post = _post(sequelize, DataTypes);
//   var professors = _professors(sequelize, DataTypes);
//   var quizzes = _quizzes(sequelize, DataTypes);
//   var students = _students(sequelize, DataTypes);
//   var teacher = _teacher(sequelize, DataTypes);
//   var workload = _workload(sequelize, DataTypes);
//
//
//   return {
//     discipline,
//     distributed_load,
//     groups,
//     post,
//     professors,
//     quizzes,
//     students,
//     teacher,
//     workload,
//   };
// }
// module.exports = initModels;
// module.exports.initModels = initModels;
// module.exports.default = initModels;
