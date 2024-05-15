# Reddit to LinkedIn Poster

This Node.js script fetches the top posts from a specified subreddit on Reddit and posts the best one to LinkedIn.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
  - [getRedditPosts](#getredditposts)
  - [postInLinkedIn](#postinlinkedin)
  - [getUserId](#getuserid)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navega al directorio del proyecto:

```bash
cd <directorio-del-proyecto>
```

3. Instala las dependencias usando npm:

```bash
npm install
```

4. Crea un archivo .env en el directorio raíz y agrega tus credenciales de la API de LinkedIn:

```plaintext
LINKEDIN_CLIENT_ID=tu_ID_de_cliente_de_LinkedIn
LINKEDIN_CLIENT_SECRET=tu_secreto_de_cliente_de_LinkedIn
LINKEDIN_ACCESS_TOKEN=tu_token_de_acceso_de_LinkedIn
```

## Uso

Para iniciar el script, ejecuta:

```bash
npm start
```

## Functions

### getRedditPosts

This function retrieves the top Reddit posts.

#### Parameters

- `url` (string): The URL of the subreddit to fetch posts from.
- `maxDescriptionLength` (number): The maximum length of the post description.
- `maxPrevDateMiliseconds` (number): The maximum age of posts to consider, in milliseconds.

#### Returns

A Promise that resolves to an object representing the best Reddit post.

### postInLinkedIn

This function posts the best Reddit post on LinkedIn.

#### Parameters

- `postObject` (any): The Reddit post object to post on LinkedIn.
- `linkedInUserLocation` (string): The LinkedIn API endpoint to get user information.
- `linkedInPostLocation` (string): The LinkedIn API endpoint to post content.

#### Returns

A Promise that resolves to the LinkedIn API response.

### getUserId

This function retrieves the LinkedIn user ID.

#### Parameters

- `linkedInUserLocation` (string): The LinkedIn API endpoint to get user information.

#### Returns

A Promise that resolves to the LinkedIn user ID.

## Environment Variables

- `LINKEDIN_CLIENT_ID`: Your LinkedIn API client ID.
- `LINKEDIN_CLIENT_SECRET`: Your LinkedIn API client secret.
- `LINKEDIN_ACCESS_TOKEN`: Your LinkedIn API access token.

## Dependencies

- `dotenv`: To load environment variables.
- `axios`: To make HTTP requests.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
