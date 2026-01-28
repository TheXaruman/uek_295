/**
 * Contains metadata information for the Swagger documentation of the API.
 *
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the API.
 * @property {string} docPath - The path where the API documentation can be found.
 * @property {Object} author - Information about the author of the API.
 * @property {string} author.name - The name of the author.
 * @property {string} author.email - The email address of the author.
 * @property {string} author.url - The URL to the author's website or profile.
 */
export const swaggerInfo = {
  title: 'Todo API von Alwin Litscher',
  description: 'Ein API zur Verwaltung von Todo items',
  docPath: 'docs',
  author: {
    name: 'Alwin Litscher',
    email: 'alwin.litscher@example.com',
    url: 'https://www.example.com',
  },
} as const;
