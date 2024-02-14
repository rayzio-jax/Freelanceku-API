# Freelancekuuu API

Do you ever think that why every freelancing platform have their own data and it's not integrated each other, so if you wanna find a freelancer to hire you should look into different platforms? So this API might help any new freelancing platform to integrate data each other, and you can customize your own tax or fee for your platform services, or developing a features that value your platform from other platform.

## Purpose

This API intentionally to support integration data of freelancers into such of freelancing platform or marketplace. So any platform could focus building their own features instead, and use this API to integrate data of freelancers.

Example, if you building a platform XYZ and you need data about freelancers, you could use this API to integrate with freelancers data, and you can focus to build a features for your platform such as chatbot, real-time chat for freelancer, customer service chat, built-in meeting feature, and etc.

## Endpoint

### Required headers for authorization

* api-key: YOUR_API_KEY

### Query On Every GET Request

| Key       | Type   | Value                                                              |
| --------- | ------ | ------------------------------------------------------------------ |
| size      | number | MAX_DATA_IN_PAGE                                                   |
| page      | number | CURRENT_PAGE                                                       |
| sortBy    | string | user: ["username","email"]<br />transaction: ["amount", "status"]" |
| sortOrder | string | ["asc", "desc"]                                                    |

### Public endpoint

#### GET

Get all user as a public

```bash
/v1/users/public
```

#### POST

Register new user

```bash
/v1/auth/register
```

Body

| Value       | Type                 | Optional |
| ----------- | -------------------- | -------- |
| first_name  | string               | ✖️     |
| last_name   | string               | ✖️     |
| username    | string               | ✖️     |
| email       | string               | ✖️     |
| password    | string               | ✖️     |
| phone       | [countryID] + number | ✔️     |
| street      | string               | ✔️     |
| city        | string               | ✔️     |
| province    | string               | ✔️     |
| country     | string               | ✔️     |
| description | string               | ✔️     |

Login a user

```bash
/v1/auth/login
```

Body

| Value    | Type   |
| -------- | ------ |
| email    | string |
| password | string |

### Endpoint (authentication required)

#### GET

Get information of all user

```bash
/v1/users
```

Get current logged in user

```bash
/v1/user/:username
```

Get a user information

```bash
/v1/user/find?username="USERNAME"
```

| Query    | Type   |
| -------- | ------ |
| username | string |

Logout current user

```bash
/v1/auth/logout
```

Get all transaction log

```bash
/v1/transactions
```

#### POST

Create new transaction log

```bash
/v1/transaction/new
```

Body

| Value          | Type                                                    |
| -------------- | ------------------------------------------------------- |
| payment_id     | string                                                  |
| sender_email   | string                                                  |
| receiver_email | string                                                  |
| amount         | number                                                  |
| message        | string                                                  |
| status         | string enum<br />[ UNPROCESSED, FAILED, PENDING, DONE ] |

#### PATCH

Update user data

```bash
/v1/user/:username
```

Body

| Value           | Type   | Optional |
| --------------- | ------ | -------- |
| new_first_name  | string | ✔️     |
| new_last_name   | string | ✔️     |
| new_username    | string | ✔️     |
| new_phone       | number | ✔️     |
| new_street      | string | ✔️     |
| new_city        | string | ✔️     |
| new_province    | string | ✔️     |
| new_country     | string | ✔️     |
| new_description | string | ✔️     |

> all value here is optional, just fill what you need and leave the rest empty or remain as current value

Update transaction status by id or payment id

* By ID

  ```bash
  /v1/transaction/status/:id
  ```

* By payment ID

  ```bash
  /v1/transaction/status/:payment_id
  ```

| Value      | Type   | Optional |
| ---------- | ------ | -------- |
| new_status | string | ✖️     |

> new status must be one of:
> [ UNPROCESSED, FAILED, PENDING, DONE ]

#### DELETE

Delete user by username

```bash
/v1/user/:username
```
