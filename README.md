# OnlyMaps Server

## Routes

### Bathy Routes

| Method | Route         | Description                      |
| ------ | ------------- | -------------------------------- |
| GET    | /api/grid     | Returns all maps DONE            |
| GET    | /api/grid/:id | Returns the specified grid       |
| POST   | /api/grid     | Creates a new grid DONE          |
| PUT    | /api/grid/:id | Edits the specified grid         |
| DELETE | /api/grid/:id | Deletes the specified grid       |
| POST   | /api/upload   | Sends an image the specified map |

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
