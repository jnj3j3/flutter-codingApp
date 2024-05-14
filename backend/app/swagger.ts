import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "100.106.99.20:80",
  schemes: ["http"],
  tags:[
    {
      name:"user",
      description:"User routes"
    },
    {
      name:"code_board",
      description:"Code_board routes"
    },{
      name:"code_jobs",
      description:"Code_jobs routes"
    }
  ],
  basePath:"/"
};
const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./server","./app/routes/*"
];
swaggerAutogen(outputFile, endpointsFiles, doc);