# Freelance API

This is a public Freelance API where you can get a data of freelancers. If this API is approved by government to integrate data of many people identity I might need a team to maintenance this and handle all kind of regulations.

## Purpose

This API intentionally to support integrationd data of freelancers, and for any freelance market to get freelancer data to integrated each other.

## Endpoint

### Required Header

* api-key: YOUR_API_KEY

### Public endpoint

#### GET

Get all user as a public

* ```bash
  /v1/user/public
  ```

#### POST

Register new user

* ```bash
  /v1/auth/register
  ```
Body
| Value    | Type   | Option  |
| -------- | ------ | ------- |
| username | string | max: 20 |
| email    | string | max: 30 |
| password | string | max: 14 |
| role     | string | max: 10 |

Login a user

* ```bash
  /v1/auth/login
  ```
Body
| Value    | Type   |
| -------- | ------ |
| email    | string |
| password | string |

### Endpoint (authentication required)

#### GET

Get all freelancer

* ```bash
  /v1/freelancer
  ```

Get full information of all user

* ```bash
  /v1/user
  ```

Get all transaction log

* ```bash
  /v1/transaction
  ```

#### POST

Register new freelancer

* ```bash
  /v1/freelancer/new
  ```
Body
| Value       | Type   | Option                     |
| ----------- | ------ | -------------------------- |
| first_name  | string | max: 30                    |
| last_name   | string | max: 30                    |
| username    | string | max: 20                    |
| email       | string | max: 30                    |
| phone       | string | max: 12<br />match: number |
| address     | string | max 100                    |
| province    | string | max: 50                    |
| country     | string | max: 20                    |
| description | string | max: 1000                  |

Create new transaction log

* ```bash
  /v1/transaction/new
  ```
Body
| Value          | Type   | Option   |
| -------------- | ------ | -------- |
| sender_email   | string |          |
| receiver_email | string |          |
| amount         | number | max: 10  |
| message        | string | max: 100 |

#### PATCH

Update user by username

* ```bash
  /v1/user/:username
  ```

Body
| Value        | Type   | Option  |
| ------------ | ------ | ------- |
| new_username | string | max: 20 |

Update freelancer by username

* ```bash
  /v1/freelancer/:username
  ```

Body
| Value           | Type   | Option                     |
| --------------- | ------ | -------------------------- |
| new_first_name  | string | max: 30                    |
| new_last_name   | string | max: 30                    |
| new_username    | string | max: 20                    |
| new_email       | string | max: 30                    |
| new_phone       | string | max: 12<br />match: number |
| new_address     | string | max 100                    |
| new_province    | string | max: 50                    |
| new_country     | string | max: 20                    |
| new_description | string | max: 1000                  |

#### DELETE

Delete user by username

* ```bash
  /v1/user/:username
  ```
