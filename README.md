# views-badge

[![license][license-image]][license-url]
[![views][views-image]][views-url]

A badge generator service to count page views.

## Usage

Copy the markdown snippet and change the `page`.

`![views](https://views-badge.vercel.app/{page})`

## Deploy

Install dependencies.

`$ yarn install --production`

Start service.

`$ yarn serve`

## Docker

Build image.

`$ docker build -t views-badge .`

Run container.

`$ docker run -d -p 8000:8000 --name views-badge views-badge`

## Configuration

| Environment variables | Description                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `BASE_API_PATH`       | The counter service API (default is `https://countapi.xyz`) can be replaced with a self-hosted [CountAPI](https://github.com/akijoey/countapi). |
| `HOST`                | The hostname or IP address of the service.                                                                                                      |
| `PORT`                | The port number of the service.                                                                                                                 |

## License

[MIT][license-url] © AkiJoey

[license-image]: https://img.shields.io/github/license/akijoey/views-badge
[license-url]: https://github.com/akijoey/views-badge/blob/master/LICENSE
[views-image]: https://views-badge.vercel.app/views-badge
[views-url]: https://github.com/akijoey/views-badge
