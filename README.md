# Freelance API

This is a public Freelance API where you can get a data of freelancers. If this API is approved by government to integrate data of many people identity I might need a team to maintenance this and handle all kind of regulations.

## Purpose

This API intentionally to support integrationd data of freelancers, and for any freelance market to get freelancer data to integrated each other.

## Endpoint

#### Public endpoint

#### GET
Get all freelancers
* ```bash
  /v1/freelancers
  ```

Get all users
* ```bash
  /v1/users
  ```

#### POST
Register new user

* ```bash
  /v1/auth/register
  ```
Register new freelancers
| Value  | Type | Option |
| --- | --- | --- |
| username  | string  | max: 20 |
| email  | string  | max: 30 |
| password  | string  | max: 14 |
| role  | string  | max: 10 |

* ```bash
  /v1/auth/login
  ```
Login a user
| Value  | Type|
| --- | --- |
| email  | string |
| password  | string |

* ```bash
  /v1/freelancers
  ```
Register new freelancers
| Value  | Type | Option |
| --- | --- | --- |
| first_name  | string  | max: 30 |
| last_name  | string  | max: 30 |
| email  | string  | max: 30 |
| phone  | string  | max: 12 <br> match: number |
| country  | string  | max: 20 |

#### Endpoint (authentication required)

#### GET
Get full information of all user
* ```bash
  /v1/users/all
  ```

#### PATCH
Update user value
| Value  | Type | Option |
| --- | --- | --- |
| username  | string  | max: 20 |
* ```bash
  /v1/users?id={userId}
  ```

#### DELETE
Delete user by user id
* ```bash
  /v1/users?id={userId}
  ```
