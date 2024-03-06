# OnlyMaps Server

## Routes

### Bathy Routes

| Method | Route         | Description                             |
| ------ | ------------- | --------------------------------------- |
| GET    | /api/grid     | Returns all tiles                       |
| GET    | /api/grid/:id | Returns the specified tile              |
| POST   | /api/grid     | Creates a new tile                      |
| PUT    | /api/grid/:id | Edits the specified tile                |
| DELETE | /api/grid/:id | Deletes the specified tile              |
| POST   | /api/upload   | Uploads an image to Cloudinary NOT USED |
| GET    | /api/download | Downloads a coverage from GeoServer     |

### Authentication Routes

| Method | Route        | Description        |
| ------ | ------------ | ------------------ |
| POST   | /auth/signup | Creates a new user |
| POST   | /auth/login  | Logs the user      |
| GET    | /auth/verify | Verifies the JWT   |

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
  imgUrl: String
}
```

### User Schema

```js
{
  name: String
  email: String,
  password: String,
}
```
