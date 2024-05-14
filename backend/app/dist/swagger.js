"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: "My API",
        description: "Description",
    },
    host: "100.106.99.20:80",
    schemes: ["http"],
    tags: [
        {
            name: "user",
            description: "User routes"
        },
        {
            name: "code_board",
            description: "Code_board routes"
        }, {
            name: "code_jobs",
            description: "Code_jobs routes"
        }
    ],
    basePath: "/"
};
const outputFile = "./swagger-output.json";
const endpointsFiles = [
    "./server", "./app/routes/*"
];
(0, swagger_autogen_1.default)(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map