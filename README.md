# OnlyMaps Server

## Routes

### Grid Routes

| Method | Route         | Description                                              |
| ------ | ------------- | -------------------------------------------------------- |
| GET    | /api/grid     | Returns all tiles                                        |
| POST   | /api/grid     | Creates new tiles using the files in the /geojson folder |
| GET    | /api/download | Endpoint for downloading coverage data from GeoServer    |

### Authentication Routes

| Method | Route                 | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| POST   | /auth/signup          | Creates a new user                           |
| POST   | /auth/login           | Verifies email and password and return a JWT |
| GET    | /auth/verify          | Verifies JWT stored on the client            |
| POST   | /auth/change-password | Allows a user to change their password       |

### User Feedback Routes

| Method | Route         | Description                           |
| ------ | ------------- | ------------------------------------- |
| POST   | /api/feedback | Allows a user to send a feedback form |

## Models

### Polygon Schema

```js
{
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true
  }
}
```

### Grid Schema

```js
{
  name: String,
  location: polygonSchema,
}
```

### User Schema

```js
{
  email: String,
  password: String,
}
```

### Feedback Schema

```js
{
  category: String,
  rating: Number,
  feedback: String,
  email: String,
}
```
