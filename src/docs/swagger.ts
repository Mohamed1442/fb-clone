import swaggerJSDoc from "swagger-jsdoc";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.fb-clone-production.up.railway.app"
    : "http://localhost:4000";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Facebook Clone API",
      version: "1.0.0",
      description: "API documentation for a Facebook clone backend",
    },
    servers: [
      {
        url: serverUrl,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // where Swagger will look for annotations
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
