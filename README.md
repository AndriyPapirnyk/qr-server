![Logo](https://qrcode-app.co/img/logo-big.png)


# QR Server

A group project that helps to verify the device by scanning a qr code and entering the results

## Tech Stack


**Server:** Node.js, Express, Mongodb, Mongoose


## Deployment

To deploy this project run

server:
```bash
  npm i
  npm start
```

## Server API

Get all users:
```bash
  /api/user/getAllUsers
```

Get all shop products:
```bash
  /api/user/getAllProducts
```

Get scan count:
```bash
  /api/user/getCount
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


## Features

- user authorization by scanning a QR code
- management of scan results by the unique ID of the device
- scanning limit (1 time per day)


## Authors

- [AndriyPapirnyk](https://github.com/AndriyPapirnyk)
- [OstapoKapo](https://github.com/OstapoKapo)

## Feedback

If you like our work, please subscribe and add a star to this project :)
